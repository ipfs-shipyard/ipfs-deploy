const ora = require('ora')
const fp = require('lodash/fp')

const { logError } = require('./logging')

const setupPinata = require('./pinners/pinata')
const setupInfura = require('./pinners/infura')

const updateCloudflareDns = require('./dnslink/cloudflare')

const httpGatewayUrl = require('./utils/gateway')
const copyUrlToClipboard = require('./utils/copy-url-clipboard')
const guessPathIfEmpty = require('./utils/guess-path')
const openUrl = require('./utils/guess-path')
const showSize = require('./utils/show-size')

async function deploy({
  publicDirPath,
  copyHttpGatewayUrlToClipboard = false,
  open = false,
  remotePinners = ['infura'],
  dnsProviders = [],
  siteDomain,
  credentials = {
    cloudflare: {
      apiEmail,
      apiKey,
      zone,
      record,
    },
    pinata: {
      apiKey,
      secretApiKey,
    },
  },
} = {}) {
  publicDirPath = guessPathIfEmpty(publicDirPath)

  if (!publicDirPath) {
    return undefined
  }

  const readableSize = await showSize(publicDirPath)

  if (!readableSize) {
    return undefined
  }

  let successfulRemotePinners = []
  const pinnedHashes = {}

  if (remotePinners.includes('infura')) {
    const addToInfura = setupInfura()
    const infuraHash = await addToInfura(publicDirPath)

    if (infuraHash) {
      successfulRemotePinners = successfulRemotePinners.concat(['infura'])
      Object.assign(pinnedHashes, { infuraHash })
    }
  }

  if (remotePinners.includes('pinata')) {
    const addToPinata = setupPinata(credentials.pinata)
    const pinataHash = await addToPinata(publicDirPath, {
      name:
        (credentials.cloudflare && credentials.cloudflare.record) ||
        siteDomain ||
        __dirname,
    })

    if (pinataHash) {
      successfulRemotePinners = successfulRemotePinners.concat(['pinata'])
      Object.assign(pinnedHashes, { pinataHash })
    }
  }

  if (successfulRemotePinners.length > 0) {
    const pinnedHash = Object.values(pinnedHashes)[0]
    const isEqual = pinnedHash => pinnedHash === pinnedHash
    if (!fp.every(isEqual)(Object.values(pinnedHashes))) {
      const spinner = ora()
      spinner.fail('≠  Found inconsistency in pinned hashes:')
      logError(pinnedHashes)
      return undefined
    }

    let dnslinkedHostname
    if (dnsProviders.includes('cloudflare')) {
      dnslinkedHostname = await updateCloudflareDns(
        siteDomain,
        credentials.cloudflare,
        pinnedHash
      )
    }

    const gatewayUrls = successfulRemotePinners.map(pinner =>
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
  } else {
    logError('Failed to deploy.')
    return undefined
  }
}

module.exports = deploy
