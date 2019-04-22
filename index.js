const util = require('util')
const { existsSync } = require('fs')
const stringify = require('json-stringify-safe')
const prettier = require('prettier')
const jsonifyError = require('jsonify-error')
const trammel = util.promisify(require('trammel'))
const byteSize = require('byte-size')
const clipboardy = require('clipboardy')
const publicIp = require('public-ip')
const IPFS = require('ipfs')
const pinataSDK = require('@pinata/sdk')
const got = require('got')
const updateCloudflareDnslink = require('dnslink-cloudflare')
const ora = require('ora')
const chalk = require('chalk')
const doOpen = require('open')
const _ = require('lodash')
const fp = require('lodash/fp')
const Multiaddr = require('multiaddr')
ipaddr = require('ipaddr.js')
const neatFrame = require('neat-frame')
const { stripIndent } = require('common-tags')

// # Pure functions
function publicGatewayUrl(hash) {
  return `https://ipfs.io/ipfs/${hash}`
}

function logError(e) {
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
  const beautifulErrorString = beautifyStr(eStr)
  console.error(beautifulErrorString)
  return beautifulErrorString
}

const white = chalk.whiteBright

// Effectful functions

function guessedPath() {
  const guesses = [
    '_site', // jekyll, hakyll
    'site',
    'public', // gatsby, hugo
    'dist', // nuxt
    'output', // pelican
    'out', // hexo
    'build', // metalsmith, middleman
    'website/build', // docusaurus
    'docs',
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
      process.exit(1)
    }
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
      spinner.info(`🔗 ${white(content)}.`)
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
  } catch (e) {
    spinner.fail("⚖  Couldn't calculate website size.")
    logError(e)
    process.exit(1)
  }
}

async function withIpfsNode(deployerFn) {
  const spinner = ora()

  spinner.start('♻️️  Starting temporary IPFS node…\n')
  try {
    const node = new IPFS({
      silent: true,
      config: {
        Addresses: {
          Swarm: [
            '/ip4/0.0.0.0/tcp/4002',
            `/ip4/${await publicIp.v4()}/tcp/4002`,
            '/ip6/::/tcp/4002',
            `/ip6/${await publicIp.v6()}/tcp/4002`,
          ],
        },
      },
      EXPERIMENTAL: {
        dht: true,
      },
    })

    node.on('ready', async () => {
      spinner.succeed('☎️  Connected to temporary IPFS node.')
      const hash = await deployerFn(node)
      await stopIpfsNode(node)
      process.stdout.write(hash + '\n')
    })
  } catch (e) {
    spinner.fail("💔 Couldn't start temporary IPFS node.")
    logError(e)
    process.exit(1)
  }
}

async function stopIpfsNode(node) {
  const spinner = ora()
  spinner.start('✋️ Stopping temporary IPFS node…')
  try {
    await node.stop()
    spinner.succeed('✋️ Stopped temporary IPFS node.')
  } catch (e) {
    spinner.fail("🚂 Couldn't stop temporary IPFS node.")
    logError(e)
  }
}

async function pinToTmpIpfsNode(ipfsNode, publicDirPath) {
  const spinner = ora()

  spinner.start('🔗 Pinning to temporary IPFS node…')
  const localPinResult = await ipfsNode.addFromFs(publicDirPath, {
    recursive: true,
  })
  const { hash } = localPinResult[localPinResult.length - 1]
  spinner.succeed(
    `📌 Pinned ${chalk.blue(publicDirPath)} to temporary IPFS node.`
  )
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
    const id = await nodeId()
    const addresses = id.addresses
    const publicMultiaddresses = addresses
      .map(multiaddress => {
        let ipAddress
        let nodeMaddr
        try {
          nodeMaddr = Multiaddr(multiaddress)
          const nodeAddr = nodeMaddr.nodeAddress()
          ipAddress = ipaddr.parse(nodeAddr.address)
        } catch (e) {
          ipAddress = null
        }
        // unicast is a regular public address
        if (ipAddress && ipAddress.range() === 'unicast') {
          return nodeMaddr
        } else {
          return null
        }
      })
      .filter(nodeMaddr => nodeMaddr !== null)

    const pinataOptions = {
      host_nodes: publicMultiaddresses,
      pinataMetadata: metadata,
    }

    try {
      const pinata = pinataSDK(credentials.apiKey, credentials.secretApiKey)

      await pinata.pinHashToIPFS(hash, pinataOptions)

      spinner.succeed("📌 It's pinned to Pinata now.")
      return true
    } catch (e) {
      spinner.fail("💔 Pinning to Pinata didn't work.")
      logError(e)
      return false
    }
  }
}

async function pinToInfura(hash) {
  const spinner = ora()

  spinner.start(`📠 Requesting remote pin to ${white('infura.io')}…`)

  let infuraResponse
  try {
    infuraResponse = await got(
      `https://ipfs.infura.io:5001/api/v0/pin/add?arg=${hash}` +
        '&recursive=true'
    )

    if (infuraResponse && infuraResponse.statusCode === 200) {
      spinner.succeed("📌 It's pinned to Infura now.")
      return true
    } else {
      spinner.fail("💔 Pinning to Infura didn't work.")
      return false
    }
  } catch (e) {
    spinner.fail("💔 Pinning to Infura didn't work.")
    logError(e)
    return false
  }
}

function copyUrlToClipboard(hash) {
  const spinner = ora()
  spinner.start('📋 Copying public gateway URL to clipboard…')
  clipboardy.writeSync(publicGatewayUrl(hash))
  spinner.succeed('📋 Copied public gateway URL to clipboard:')
  spinner.info(`🔗 ${chalk.green(publicGatewayUrl(hash))}`)
}

async function deploy({
  publicDirPath,
  copyPublicGatewayUrlToClipboard = false,
  open = false,
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

  await showSize(publicDirPath)

  await withIpfsNode(async ipfsNode => {
    const hash = await pinToTmpIpfsNode(ipfsNode, publicDirPath)

    let successfulRemotePinners = []

    if (remotePinners.includes('pinata')) {
      if (
        await pinToPinata(
          ipfsNode,
          credentials.pinata,
          { name: siteDomain },
          hash
        )
      ) {
        successfulRemotePinners = successfulRemotePinners.concat(['pinata'])
      }
    }

    if (remotePinners.includes('infura')) {
      if (await pinToInfura(hash)) {
        successfulRemotePinners = successfulRemotePinners.concat(['infura'])
      }
    }

    if (successfulRemotePinners.length > 0) {
      if (copyPublicGatewayUrlToClipboard) {
        copyUrlToClipboard(hash)
      }

      if (dnsProviders.includes('cloudflare')) {
        await updateCloudflareDns(siteDomain, credentials.cloudflare, hash)
      }

      if (open && _.isEmpty(dnsProviders))
        await openUrl(publicGatewayUrl(hash))
      if (open && !_.isEmpty(dnsProviders))
        await openUrl(`https://${siteDomain}`)
    } else {
      logError('Failed to deploy.')
      process.exit(1)
    }
    return hash
  })
}

module.exports = deploy
