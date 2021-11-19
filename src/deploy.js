'use strict'

const chalk = require('chalk')
const path = require('path')
const fs = require('fs')

const { dnsLinkersMap } = require('./dnslinkers')
const { pinnersMap } = require('./pinners')
const { guessPath, getReadableSize, terminalUrl } = require('./utils')

/**
 * @typedef {import('./dnslinkers/types').DNSLinker} DNSLinker
 * @typedef {import('./pinners/types').PinningService} PinningService
 * @typedef {import('./pinners/types').PinDirOptions} PinDirOptions
 * @typedef {import('./types').DeployOptions} DeployOptions
 * @typedef {import('./types').Logger} Logger
 */

/**
 * @param {PinningService[]} services
 * @param {string|undefined} cid
 * @param {string|undefined} dir
 * @param {PinDirOptions} pinOpts
 * @param {Logger} logger
 */
async function pinCidOrDir (services, cid, dir, pinOpts, logger) {
  const pinnedCids = []
  const gatewayUrls = []

  if (!cid && !dir) {
    throw new Error('either cid or dir is required')
  }

  if (dir) {
    dir = path.resolve(dir)
  }

  for (const service of services) {
    const serviceName = chalk.whiteBright(service.displayName)
    let lastCid

    if (cid) {
      logger.info(`📠  Pinning CID to ${serviceName}…`)
      await service.pinCid(cid, pinOpts.tag)
      lastCid = cid
      logger.info(`📌  CID pinned to ${serviceName}:`)
    } else {
      logger.info(`📠  Uploading and pinning to ${serviceName}…`)
      // @ts-ignore
      lastCid = await service.pinDir(dir, pinOpts)
      logger.info(`📌  Added and pinned to ${serviceName} with CID:`)
    }

    const url = service.gatewayUrl(lastCid)
    logger.info(terminalUrl(lastCid, url))

    gatewayUrls.push(url)
    pinnedCids.push(lastCid)
  }

  return {
    pinnedCids,
    gatewayUrls
  }
}

/**
 * @param {DNSLinker[]} services
 * @param {string} cid
 * @param {Logger} logger
 */
async function dnsLink (services, cid, logger) {
  const hostnames = []

  for (const provider of services) {
    const providerName = chalk.whiteBright(provider.displayName)
    logger.info(`📡  Beaming new CID to DNS provider ${providerName}…`)

    const { record, value } = await provider.link(cid)

    logger.info(`🔄  Updated DNS TXT ${chalk.whiteBright(record)} to:`)
    logger.info(`🔗  ${chalk.whiteBright(value)}`)

    hostnames.push(record.split('.').slice(1).join('.'))
  }

  return hostnames
}

/**
 * Copy URL to clipboard. This function does not throw, but
 * prints any error instead as it is not a fundamental part of
 * the deploying process.
 *
 * @param {string[]} hostnames
 * @param {string[]} gatewayUrls
 * @param {Logger} logger
 */
function copyToClipboard (hostnames, gatewayUrls, logger) {
  let toCopy
  if (hostnames.length > 0) {
    toCopy = hostnames[hostnames.length - 1]
  } else {
    toCopy = gatewayUrls[gatewayUrls.length - 1]
  }

  logger.info('📋  Copying HTTP gateway URL to clipboard…')

  if (!toCopy.startsWith('https')) {
    toCopy = `https://${toCopy}`
  }

  try {
    const clipboardy = require('clipboardy')
    clipboardy.writeSync(toCopy)
    logger.info('📋  Copied HTTP gateway URL to clipboard:')
    logger.info(terminalUrl(toCopy, toCopy))
  } catch (e) {
    logger.info('⚠️  Could not copy URL to clipboard.')
    logger.error(e.stack || e.toString())
  }
}

/**
 * Open URLs on web browser. This function does not throw, but
 * prints any error instead as it is not a fundamental part of
 * the deploying process.
 *
 * @param {string[]} gatewayUrls
 * @param {string[]} hostnames
 * @param {Logger} logger
 */
function openUrlsBrowser (gatewayUrls, hostnames, logger) {
  logger.info('🏄  Opening URLs on web browser...')

  try {
    const open = require('open')
    gatewayUrls.forEach(url => { open(url) })
    hostnames.forEach(hostname => open(`https://${hostname}`))
    logger.info('🏄  All URLs opened.')
  } catch (e) {
    logger.info('⚠️  Could not open URLs on web browser.')
    logger.error(e.stack || e.toString())
  }
}

const dummyLogger = /** @type {Logger} */({
  info: () => {},
  error: () => {},
  out: () => {}
})

/**
 * @param {string|undefined} dir
 * @param {string|undefined} cid
 * @param {Logger} logger
 */
async function checkDirAndCid (dir, cid, logger) {
  if (dir && cid) {
    throw new Error('cannot deploy a directory and a CID at the same time')
  }

  if (!dir && !cid) {
    logger.info(`🤔  No ${chalk.whiteBright('path')} argument specified. Looking for common ones…`)
    dir = guessPath()
    logger.info(`📂  Found local ${chalk.blueBright(dir)} directory. Deploying that.`)
  } else if (dir) {
    logger.info(`📂  Deploying ${chalk.blueBright(dir)} directory.`)
  } else if (cid) {
    logger.info(`📂  Deploying ${chalk.blueBright(cid)}.`)
  }

  if (dir) {
    logger.info(`📦  Calculating size of ${chalk.blueBright(dir)}…`)
    const readableSize = await getReadableSize(dir)
    logger.info(`🚚  Directory ${chalk.blueBright(dir)} weighs ${readableSize}.`)

    dir = path.normalize(dir)

    if (!fs.statSync(dir).isDirectory()) {
      logger.info('⚠️   Given path is not a directory. Continuing.')
    }
  }

  return { cid, dir }
}

/**
 * @param {DeployOptions} options
 * @returns {Promise<string>}
 */
async function deploy ({
  dir,
  cid,
  tag,

  copyUrl = false,
  openUrls = false,
  hiddenFiles = false,

  uploadServices: uploadServicesIds = [],
  pinningServices: pinningServicesIds = [],
  dnsProviders: dnsProvidersIds = [],

  dnsProvidersCredentials = {},
  pinningServicesCredentials = {},

  logger = dummyLogger
}) {
  const res = await checkDirAndCid(dir, cid, logger)
  dir = res.dir
  cid = res.cid

  tag = tag || __dirname

  // In the case we only set pinning services and we're deploying a directory,
  // then call those upload services.
  if (pinningServicesIds.length > 0 && uploadServicesIds.length === 0 && dir) {
    uploadServicesIds = pinningServicesIds
    pinningServicesIds = []
  }

  if (uploadServicesIds.length + pinningServicesIds.length === 0) {
    throw new Error('an upload or pinning service is required to deploy')
  }

  if (cid && uploadServicesIds.length > 0) {
    throw new Error('cannot use uploading services to deploy CIDs')
  }

  logger.info('⚙️   Validating pinners configurations…')
  const uploadServices = uploadServicesIds.map(name => {
    const Pinner = pinnersMap.get(name)
    return new Pinner(pinningServicesCredentials[name])
  })

  const pinningServices = pinningServicesIds.map(name => {
    const Pinner = pinnersMap.get(name)
    return new Pinner(pinningServicesCredentials[name])
  })

  logger.info('⚙️   Validating DNS providers configurations…')
  const dnsProviders = dnsProvidersIds.map(name => {
    const DNSLinker = dnsLinkersMap.get(name)
    return new DNSLinker(dnsProvidersCredentials[name])
  })

  const pinnedCids = /** @type {string[]} */([])
  const gatewayUrls = /** @type {string[]} */([])

  if (uploadServices.length > 0) {
    const res = await pinCidOrDir(uploadServices, undefined, dir, { tag, hidden: hiddenFiles }, logger)
    pinnedCids.push(...res.pinnedCids)
    gatewayUrls.push(...res.gatewayUrls)
  }

  // If one of the pinned CIDs doesn't match the other ones,
  // alert about that.
  if (pinnedCids.some(v => v !== pinnedCids[0])) {
    throw new Error(`Found inconsistency in pinned CIDs: ${pinnedCids}`)
  }

  cid = cid || pinnedCids[0]
  if (pinningServices.length > 0) {
    const res = await pinCidOrDir(pinningServices, cid, undefined, { tag }, logger)
    pinnedCids.push(...res.pinnedCids)
    gatewayUrls.push(...res.gatewayUrls)
  }

  const hostnames = await dnsLink(dnsProviders, cid, logger)

  if (openUrls) {
    openUrlsBrowser(gatewayUrls, hostnames, logger)
  }

  if (copyUrl) {
    copyToClipboard(hostnames, gatewayUrls, logger)
  }

  logger.out(cid)
  return cid
}

module.exports = deploy
