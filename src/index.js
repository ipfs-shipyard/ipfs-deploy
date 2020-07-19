const _ = require('lodash')
const { logger, logError } = require('./logging')

const guessPathIfEmpty = require('./guess-path')
const showSize = require('./show-size')
const { openUrl, gatewayHttpUrl, copyUrl } = require('./url-utils')

const dnslinkProviders = require('./dnslink')
const pinnerProviders = require('./pinners')

function sameValues (obj) {
  const values = Object.values(obj)
  return values.every((val, i, arr) => val === arr[0])
}

async function deploy ({
  publicDirPath,
  copyHttpGatewayUrlToClipboard = false,
  open = false,
  uniqueUpload,
  remotePinners = ['infura'],
  dnsProviders = [],
  siteDomain,
  credentials = {},
  writeLog = null,
  writeError = null
} = {}) {
  publicDirPath = guessPathIfEmpty(publicDirPath)

  if (!publicDirPath) {
    return undefined
  }

  const readableSize = await showSize(publicDirPath, { writeLog, writeError })

  if (!readableSize) {
    return undefined
  }

  const tag =
    (credentials.cloudflare && credentials.cloudflare.record) ||
    siteDomain ||
    __dirname

  if (uniqueUpload) {
    if (remotePinners.includes(uniqueUpload)) {
      remotePinners.splice(remotePinners.indexOf(uniqueUpload), 1)
    }

    remotePinners.unshift(uniqueUpload)
  }

  const successfulPinners = []
  const pinnedHashes = {}
  let lastHash = null

  for (const pinnerName of remotePinners) {
    const pinner = await pinnerProviders[_.camelCase(pinnerName)]({
      ...credentials[_.camelCase(pinnerName)],
      writeLog,
      writeError
    })

    if (!pinner) {
      return
    }

    if (uniqueUpload && uniqueUpload !== pinnerName) {
      await pinner.pinHash(lastHash, tag)
    } else {
      lastHash = await pinner.pinDir(publicDirPath, tag)

      if (lastHash) {
        successfulPinners.push(pinnerName)
        Object.assign(pinnedHashes, { [pinnerName]: lastHash })
      }
    }
  }

  if (successfulPinners.length === 0) {
    logError('Failed to deploy.')
    return
  }

  if (!sameValues(pinnedHashes)) {
    const log = logger({ writeLog, writeError })
    log.fail('≠  Found inconsistency in pinned hashes:')
    logError(pinnedHashes)
    return
  }

  const pinnedHash = Object.values(pinnedHashes)[0]

  let dnslinkedHostname = null

  for (const provider of dnsProviders) {
    dnslinkedHostname = await dnslinkProviders[_.camelCase(provider)](
      siteDomain,
      pinnedHash,
      credentials[_.camelCase(provider)] || null
    )
  }

  const gatewayUrls = successfulPinners.map(pinner =>
    gatewayHttpUrl(pinnedHash, pinner)
  )

  if (open) {
    gatewayUrls.forEach(async gatewayUrl => openUrl(gatewayUrl))

    if (dnslinkedHostname) {
      await openUrl(`https://${dnslinkedHostname}`)
    }
  }

  if (copyHttpGatewayUrlToClipboard) {
    if (dnslinkedHostname) {
      copyUrl(`https://${dnslinkedHostname}`)
    } else {
      copyUrl(gatewayUrls[0])
    }
  }

  return pinnedHash
}

module.exports = deploy
