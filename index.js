const util = require('util')
const { existsSync } = require('fs')
const stringify = require('json-stringify-safe')
const prettier = require('prettier')
const jsonifyError = require('jsonify-error')
const trammel = util.promisify(require('trammel'))
const byteSize = require('byte-size')
const clipboardy = require('clipboardy')
const publicIp = require('public-ip')
const isPortReachable = require('is-port-reachable')
const ipfsClient = require('ipfs-http-client')
const IPFS = require('ipfs')
const pinataSDK = require('@pinata/sdk')
const updateCloudflareDnslink = require('dnslink-cloudflare')
const ora = require('ora')
const chalk = require('chalk')
const doOpen = require('open')
const _ = require('lodash')
const fp = require('lodash/fp')
const neatFrame = require('neat-frame')
const { stripIndent } = require('common-tags')

// # Pure functions
function httpGatewayUrl(hash, gatewayProvider = 'ipfs') {
  const gateways = {
    ipfs: 'https://ipfs.io',
    infura: 'https://ipfs.infura.io',
    pinata: 'https://gateway.pinata.cloud',
  }
  const origin = gateways[gatewayProvider] || gateways['ipfs']
  return `${origin}/ipfs/${hash}`
}

function formatError(e) {
  const prettierJson = obj =>
    prettier.format(stringify(obj), {
      parser: 'json',
      printWidth: 72,
      tabWidth: 2,
    })
  const beautifyStr = fp.pipe(
    stripIndent,
    str => neatFrame(str, { trim: false })
  )
  if (_.isError(e)) {
    eStr = prettierJson(jsonifyError(e))
  } else if (_.isString(e)) {
    eStr = e
  } else if (_.isObjectLike(e)) {
    eStr = prettierJson(e)
  }
  const beautifulErrorString = '\n' + beautifyStr(eStr)
  return beautifulErrorString
}

const white = chalk.whiteBright

// Effectful functions

function logError(e) {
  const errorString = formatError(e)
  console.error(errorString)
  return errorString
}

async function isNodeReachable(port) {
  const isIpv4Reachable = await isPortReachable(port, {
    host: await publicIp.v4(),
    timeout: 5000,
  })

  return isIpv4Reachable
}

function guessedPath() {
  // prettier-ignore
  const guesses = [
    '_site',         // jekyll, hakyll, eleventy
    'site',          // forgot which
    'public',        // gatsby, hugo
    'dist',          // nuxt
    'output',        // pelican
    'out',           // hexo
    'build',         // create-react-app, metalsmith, middleman
    'website/build', // docusaurus
    'docs',          // many others
  ]

  return fp.filter(existsSync)(guesses)[0]
}

function guessPathIfEmpty(publicPath) {
  let result
  const spinner = ora()

  if (_.isEmpty(publicPath)) {
    spinner.info(
      `🤔 No ${white('path')} argument specified. Looking for common ones…`
    )
    result = guessedPath()
    if (result) {
      spinner.succeed(
        `📂 Found local ${chalk.blue(result)} directory. Deploying that.`
      )
      return result
    } else {
      spinner.fail(
        `🔮 Couldn't guess what to deploy. Please specify a ${white('path')}.`
      )
      return undefined
    }
  } else {
    return publicPath
  }
}

async function openUrl(url) {
  const spinner = ora()
  spinner.start('🏄 Opening web browser…')
  const childProcess = await doOpen(url)
  spinner.succeed('🏄 Opened web browser (call with -O to disable.)')
  return childProcess
}

async function updateCloudflareDns(siteDomain, { apiEmail, apiKey }, hash) {
  const spinner = ora()

  spinner.start(`📡 Beaming new hash to DNS provider ${white('Cloudflare')}…`)
  if (fp.some(_.isEmpty)([siteDomain, apiEmail, apiKey])) {
    spinner.fail('💔 Missing arguments for Cloudflare API.')
    spinner.warn('🧐  Check if these environment variables are present:')
    logError(`
      IPFS_DEPLOY_SITE_DOMAIN
      IPFS_DEPLOY_CLOUDFLARE__API_EMAIL
      IPFS_DEPLOY_CLOUDFLARE__API_KEY

      You can put them in a .env file if you want and they will be picked up.
    `)
  } else {
    try {
      const api = {
        email: apiEmail,
        key: apiKey,
      }

      const opts = {
        record: siteDomain,
        zone: siteDomain,
        link: `/ipfs/${hash}`,
      }

      const content = await updateCloudflareDnslink(api, opts)
      spinner.succeed('🙌 SUCCESS!')
      spinner.info(`🔄 Updated DNS TXT ${white(opts.record)} to:`)
      spinner.info(`🔗 ${white(content)}`)
    } catch (e) {
      spinner.fail("💔 Updating Cloudflare DNS didn't work.")
      logError(e)
    }

    return siteDomain
  }
}

async function showSize(path) {
  const spinner = ora()
  spinner.start(`📦 Calculating size of ${chalk.blue(path)}…`)
  try {
    const size = await trammel(path, {
      stopOnError: true,
      type: 'raw',
    })
    const kibi = byteSize(size, { units: 'iec' })
    const readableSize = `${kibi.value} ${kibi.unit}`
    spinner.succeed(`🚚 ${chalk.blue(path)} weighs ${readableSize}.`)
    return readableSize
  } catch (e) {
    spinner.fail("⚖  Couldn't calculate website size.")
    logError(e)
    return undefined
  }
}

function startIpfsNode(port) {
  return new Promise((resolve, reject) => {
    const spinner = ora()

    spinner.start('♻️️  Starting temporary local IPFS node…\n')
    const node = new IPFS({
      silent: true,
      config: {
        Addresses: {
          Swarm: [`/ip4/0.0.0.0/tcp/${port}`],
        },
      },
    })

    node.on('ready', async () => {
      spinner.succeed('☎️  Connected to temporary local IPFS node.')
      spinner.start(`🔌 Checking if port ${port} is externally reachable…`)
      const isReachable = await isNodeReachable(port)
      if (isReachable) {
        spinner.succeed(`📶 Port ${port} is externally reachable.`)
        node.port = port
        resolve(node)
      } else {
        spinner.fail(`💔 Could not reach port ${port} from the outside :(`)
        spinner.info(
          '💡 Please forward it or try a different one with the --port option.'
        )
        reject(new Error(`Could not reach port ${port} from the outside`))
      }
    })
  })
}

async function stopIpfsNode(node) {
  const spinner = ora()
  spinner.start('✋️ Stopping temporary local IPFS node…')
  try {
    await node.stop()
    spinner.succeed('✋️ Stopped temporary local IPFS node.')
  } catch (e) {
    spinner.fail("🚂 Couldn't stop temporary local IPFS node.")
    logError(e)
  }
}

async function pinToTmpIpfsNode(ipfsNode, publicDirPath) {
  const spinner = ora()

  spinner.start('🔗 Pinning to temporary local IPFS node…')
  const localPinResult = await ipfsNode.addFromFs(publicDirPath, {
    recursive: true,
  })
  const { hash } = localPinResult[localPinResult.length - 1]
  spinner.succeed('📌 Pinned to temporary local IPFS node with hash:')
  spinner.info(`🔗 ${hash}`)
  return hash
}

async function pinToPinata(ipfsNode, credentials, metadata = {}, hash) {
  const spinner = ora()

  spinner.start(`📠 Requesting remote pin to ${white('pinata.cloud')}…`)

  if (fp.some(_.isEmpty)([credentials.apiKey, credentials.secretApiKey])) {
    spinner.fail('💔 Missing credentials for Pinata API.')
    spinner.warn('🧐  Check if these environment variables are present:')
    logError(`
      IPFS_DEPLOY_PINATA__API_KEY
      IPFS_DEPLOY_PINATA__SECRET_API_KEY

      You can put them in a .env file if you want and they will be picked up.
    `)
  } else {
    const nodeId = util.promisify(ipfsNode.id.bind(ipfsNode))
    const nodeInfo = await nodeId()

    const pinataOptions = {
      host_nodes: [
        `/ip4/${await publicIp.v4()}/tcp/${ipfsNode.port}/ipfs/${nodeInfo.id}`,
      ],
      pinataMetadata: metadata,
    }

    try {
      const pinata = pinataSDK(credentials.apiKey, credentials.secretApiKey)

      await pinata.pinHashToIPFS(hash, pinataOptions)

      spinner.succeed("📌 It's pinned to Pinata now with hash:")
      spinner.info(`🔗 ${hash}`)
      return hash
    } catch (e) {
      spinner.fail("💔 Pinning to Pinata didn't work.")
      logError(e)
      return undefined
    }
  }
}

async function addToInfura(publicDirPath) {
  const spinner = ora()

  const infuraClient = ipfsClient({
    host: 'ipfs.infura.io',
    port: '5001',
    protocol: 'https',
  })

  try {
    spinner.start(
      `📠 Uploading and pinning via https to ${white('infura.io')}…`
    )
    const response = await infuraClient.addFromFs(publicDirPath, {
      recursive: true,
    })
    spinner.succeed("📌 It's pinned to Infura now with hash:")
    const hash = response[response.length - 1].hash
    spinner.info(`🔗 ${hash}`)
    return hash
  } catch (e) {
    spinner.fail("💔 Uploading to Infura didn't work.")
    logError(e)
    return undefined
  }
}

function copyUrlToClipboard(url) {
  const spinner = ora()
  spinner.start('📋 Copying HTTP gateway URL to clipboard…')
  clipboardy.writeSync(url)
  spinner.succeed('📋 Copied HTTP gateway URL to clipboard:')
  spinner.info(`🔗 ${chalk.green(url)}`)
}

async function deploy({
  publicDirPath,
  copyHttpGatewayUrlToClipboard = false,
  open = false,
  port = '4002',
  remotePinners = ['infura'],
  dnsProviders = [],
  siteDomain,
  credentials = {
    cloudflare: {
      apiEmail,
      apiKey,
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
  let pinnedHashes = {}

  if (remotePinners.includes('infura')) {
    const infuraHash = await addToInfura(publicDirPath)
    if (infuraHash) {
      successfulRemotePinners = successfulRemotePinners.concat(['infura'])
      Object.assign(pinnedHashes, { infuraHash })
    }
  }

  if (remotePinners.includes('pinata')) {
    const ipfsNode = await startIpfsNode(port)
    const localHash = await pinToTmpIpfsNode(ipfsNode, publicDirPath)
    const pinataHash = await pinToPinata(
      ipfsNode,
      credentials.pinata,
      { name: siteDomain || __dirname },
      localHash
    )

    if (pinataHash) {
      successfulRemotePinners = successfulRemotePinners.concat(['pinata'])
      Object.assign(pinnedHashes, { localHash, pinataHash })
    }

    await stopIpfsNode(ipfsNode)
  }

  if (successfulRemotePinners.length > 0) {
    const pinnedHash = Object.values(pinnedHashes)[0]
    const gatewayUrl = httpGatewayUrl(pinnedHash, successfulRemotePinners[0])
    const isEqual = hash => hash === pinnedHash
    if (!fp.every(isEqual)(Object.values(pinnedHashes))) {
      const spinner = ora()
      spinner.fail('≠  Found inconsistency in pinned hashes:')
      logError(pinnedHashes)
    }

    if (copyHttpGatewayUrlToClipboard) {
      copyUrlToClipboard(gatewayUrl)
    }

    if (dnsProviders.includes('cloudflare')) {
      await updateCloudflareDns(siteDomain, credentials.cloudflare, pinnedHash)
    }

    if (open && _.isEmpty(dnsProviders)) {
      await openUrl(gatewayUrl)
    }
    if (open && !_.isEmpty(dnsProviders)) {
      await openUrl(`https://${siteDomain}`)
    }
    return pinnedHash
  } else {
    logError('Failed to deploy.')
    return undefined
  }
}

module.exports = deploy
