const ora = require('ora')
const { logError } = require('./logging')

const httpGatewayUrl = require('./utils/gateway')
const copyUrlToClipboard = require('./utils/copy-url-clipboard')
const guessPathIfEmpty = require('./utils/guess-path')
const openUrl = require('./utils/guess-path')
const showSize = require('./utils/show-size')

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
  credentials = {}
} = {}) {
  publicDirPath = guessPathIfEmpty(publicDirPath)

  if (!publicDirPath) {
    return undefined
  }

  const readableSize = await showSize(publicDirPath)

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
    let pinner

    try {
      pinner = await pinnerProviders[pinnerName](
        credentials[pinnerName] || null
      )
    } catch (error) {
      logError(error.toString())
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
    const spinner = ora()
    spinner.fail('≠  Found inconsistency in pinned hashes:')
    logError(pinnedHashes)
    return
  }

  const pinnedHash = Object.values(pinnedHashes)[0]

  let dnslinkedHostname = null

  for (const provider of dnsProviders) {
    dnslinkedHostname = await dnslinkProviders[provider](
      siteDomain,
      pinnedHash,
      credentials[provider] || null
    )
  }

  const gatewayUrls = successfulPinners.map(pinner =>
    httpGatewayUrl(pinnedHash, pinner)
  )

  if (open) {
    gatewayUrls.forEach(async gatewayUrl => openUrl(gatewayUrl))

    if (dnslinkedHostname) {
      await openUrl(`https://${dnslinkedHostname}`)
    }
  }

  if (copyHttpGatewayUrlToClipboard) {
    if (dnslinkedHostname) {
      copyUrlToClipboard(`https://${dnslinkedHostname}`)
    } else {
      copyUrlToClipboard(gatewayUrls[0])
    }
  }

  return pinnedHash
}

module.exports = deploy
