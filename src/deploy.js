'use strict'

const colors = require('colors/safe')
const open = require('open')
const path = require('path')
const fs = require('fs')
const clipboardy = require('clipboardy')

const { dnsLinkersMap } = require('./dnslinkers')
const { pinnersMap } = require('./pinners')
const { guessPath, getReadableSize, terminalUrl } = require('./utils')

async function pinCidOrDir ({ services, cid, dir, tag, logger }) {
  const pinnedCids = []
  const gatewayUrls = []

  for (const service of services) {
    const serviceName = colors.brightWhite(service.constructor.displayName)
    let lastCid

    if (cid) {
      logger.info(`📠  Pinning CID to ${serviceName}…`)
      await service.pinCid(cid, tag)
      lastCid = cid
      logger.info(`📌  CID pinned to ${serviceName}:`)
    } else {
      logger.info(`📠  Uploading and pinning to ${serviceName}…`)
      lastCid = await service.pinDir(dir, tag)
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

async function dnsLink ({ services, cid, logger }) {
  const hostnames = []

  for (const provider of services) {
    const providerName = colors.brightWhite(provider.constructor.displayName)
    logger.info(`📡  Beaming new CID to DNS provider ${providerName}…`)

    const { record, value } = await provider.link(cid)

    logger.info(`🔄  Updated DNS TXT ${colors.brightWhite(record)} to:`)
    logger.info(`🔗  ${colors.brightWhite(value)}`)

    hostnames.push(record.split('.').slice(1).join('.'))
  }

  return hostnames
}

function copyToClipboard ({ hostnames, gatewayUrls, logger }) {
  let toCopy
  if (hostnames.length > 0) {
    toCopy = hostnames[hostnames.length - 1]
  } else {
    toCopy = gatewayUrls[gatewayUrls.length - 1]
  }

  logger.info('📋  Copying HTTP gateway URL to clipboard…')

  try {
    clipboardy.writeSync(toCopy)
    logger.info('📋  Copied HTTP gateway URL to clipboard:')
    logger.info(terminalUrl(toCopy, toCopy))
  } catch (e) {
    logger.info('⚠️  Could not copy URL to clipboard.')
    logger.error(e)
  }
}

const dummyLogger = {
  info: () => {},
  error: () => {}
}

async function deploy ({
  dir,
  cid,
  tag,

  copyUrl = false,
  openUrls = false,

  uploadServices = [],
  pinningServices = [],
  dnsProviders = [],

  dnsProvidersCredentials = {},
  pinningServicesCredentials = {},

  logger = dummyLogger
} = {}) {
  if (dir && cid) {
    throw new Error('cannot deploy a directory and a CID at the same time')
  }

  if (!dir && !cid) {
    logger.info(`🤔  No ${colors.brightWhite('path')} argument specified. Looking for common ones…`)
    dir = guessPath()
    logger.info(`📂  Found local ${colors.blue(dir)} directory. Deploying that.`)
  } else if (!cid) {
    logger.info(`📂  Deploying ${colors.blue(dir)} directory.`)
  } else {
    logger.info(`📂  Deploying ${colors.blue(cid)}.`)
  }

  if (dir) {
    logger.info(`📦  Calculating size of ${colors.blue(dir)}…`)
    const readableSize = await getReadableSize(dir)
    logger.info(`🚚  Directory ${colors.blue(dir)} weighs ${readableSize}.`)

    dir = path.normalize(dir)

    if (!fs.statSync(dir).isDirectory()) {
      throw new Error('path must be a directory')
    }
  }

  tag = tag || __dirname

  // In the case we only set pinning services and we're deploying a directory,
  // then call those upload services.
  if (pinningServices.length > 0 && uploadServices.length === 0 && dir) {
    uploadServices = pinningServices
    pinningServices = []
  }

  if (uploadServices.length + pinningServices.length === 0) {
    throw new Error('an upload or pinning service is required to deploy')
  }

  if (cid && uploadServices.length > 0) {
    throw new Error('cannot use uploading services to deploy CIDs')
  }

  logger.info('⚙️   Validating pinners configurations…')
  uploadServices = uploadServices.map(name => {
    const Pinner = pinnersMap.get(name)
    return new Pinner(pinningServicesCredentials[name])
  })

  pinningServices = pinningServices.map(name => {
    const Pinner = pinnersMap.get(name)
    return new Pinner(pinningServicesCredentials[name])
  })

  logger.info('⚙️   Validating DNS providers configurations…')
  dnsProviders = dnsProviders.map(name => {
    const DNSLinker = dnsLinkersMap.get(name)
    return new DNSLinker(dnsProvidersCredentials[name])
  })

  const pinnedCids = []
  const gatewayUrls = []

  if (uploadServices.length > 0) {
    const res = await pinCidOrDir({ services: uploadServices, dir, tag, logger })
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
    const res = await pinCidOrDir({ services: pinningServices, cid, tag, logger })
    pinnedCids.push(...res.pinnedCids)
    gatewayUrls.push(...res.gatewayUrls)
  }

  const hostnames = await dnsLink({ services: dnsProviders, cid, logger })

  if (openUrls) {
    logger.info('🏄  Opening URLs on web browser...')
    gatewayUrls.forEach(open)
    hostnames.forEach(hostname => open(`https://${hostname}`))
    logger.info('🏄  All URLs opened.')
  }

  if (copyUrl) {
    copyToClipboard({ hostnames, gatewayUrls, logger })
  }

  return cid
}

module.exports = deploy
