const util = require('util')
const { existsSync } = require('fs')
const trammel = util.promisify(require('trammel'))
const byteSize = require('byte-size')
const IPFSFactory = require('ipfsd-ctl')
const which = require('which')
const clipboardy = require('clipboardy')
const pinataSDK = require('@pinata/sdk')
const got = require('got')
const updateCloudflareDnslink = require('dnslink-cloudflare')
const ora = require('ora')
const chalk = require('chalk')
const doOpen = require('open')
const _ = require('lodash')
const fp = require('lodash/fp')
const multiaddr = require('multiaddr')
const ip = require('ip')
const neatFrame = require('neat-frame')
const { stripIndent } = require('common-tags')

// # Pure functions
function publicGatewayUrl(hash) {
  return `https://ipfs.io/ipfs/${hash}`
}

const logError = fp.pipe(
  stripIndent,
  neatFrame,
  console.error
)

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
      logError(`${e.name}:\n${e.message}`)
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
    logError(`${e.name}:\n${e.message}`)
    process.exit(1)
  }
}

async function getIpfsDaemonAndClient() {
  const spinner = ora()

  const ipfsBinAbsPath =
    which.sync('ipfs', { nothrow: true }) ||
    which.sync('jsipfs', { nothrow: true })

  let ipfsd
  let ipfsClient

  if (ipfsBinAbsPath) {
    const type = ipfsBinAbsPath.match(/jsipfs/) ? 'js' : 'go'
    const df = IPFSFactory.create({ type, exec: ipfsBinAbsPath })
    const spawn = util.promisify(df.spawn.bind(df))
    spinner.start('♻️️  Starting local disposable IPFS daemon…')
    try {
      ipfsd = await spawn({
        disposable: true,
        init: true,
        start: false,
        defaultAddrs: true,
      })
      const start = util.promisify(ipfsd.start.bind(ipfsd))
      ipfsClient = await start([])
      spinner.succeed('☎️ Connected to local disposable IPFS daemon.')
    } catch (e) {
      spinner.fail("💔 Can't connect to local disposable IPFS daemon.")
      console.warn(`${e.name}: ${e.message}`)
    }
  }

  if (!ipfsClient) {
    const df = IPFSFactory.create({ type: 'js' })
    const spawn = util.promisify(df.spawn.bind(df))
    spinner.start('♻️️  Starting local disposable IPFS daemon…\n')
    try {
      ipfsd = await spawn({
        disposable: true,
        init: true,
        start: false,
        defaultAddrs: true,
      })
      const start = util.promisify(ipfsd.start.bind(ipfsd))
      ipfsClient = await start([])
      spinner.succeed('☎️  Connected to local disposable IPFS daemon.')
    } catch (e) {
      spinner.fail("💔 Couldn't start local disposable IPFS daemon.")
      logError(`${e.name}:\n${e.message}`)
      process.exit(1)
    }
  }

  return { ipfsd, ipfsClient }
}

async function stopIpfsDaemonIfDisposable(ipfsd) {
  if (ipfsd.disposable) {
    const stop = util.promisify(ipfsd.stop.bind(ipfsd))
    // spinner.start('✋️ Stopping IPFS daemon…')
    await stop()
    // spinner.succeed('✋️ Stopped IPFS daemon.')
  }
}

async function pinToLocalDaemon(ipfsClient, publicDirPath) {
  const spinner = ora()

  spinner.start('🔗 Pinning to local disposable IPFS daemon…')
  const localPinResult = await ipfsClient.addFromFs(publicDirPath, {
    recursive: true,
  })
  const { hash } = localPinResult[localPinResult.length - 1]
  spinner.succeed(
    `📌 Pinned ${chalk.blue(publicDirPath)} to local disposable IPFS daemon.`
  )
  return hash
}

async function pinToPinata(ipfsClient, credentials, metadata = {}, hash) {
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
    const { addresses } = await ipfsClient.id()
    const publicMultiaddresses = addresses.filter(
      multiaddress =>
        !ip.isPrivate(multiaddr(multiaddress).nodeAddress().address)
    )

    const pinataOptions = {
      host_nodes: publicMultiaddresses,
      pinataMetadata: metadata,
    }

    try {
      const pinata = pinataSDK(credentials.apiKey, credentials.secretApiKey)

      await pinata.pinHashToIPFS(hash, pinataOptions)

      spinner.succeed("📌 It's pinned to Pinata now.")
    } catch (e) {
      spinner.fail("💔 Pinning to Pinata didn't work.")
      if (e.name && e.message) {
        logError(`${e.name}:\n${e.message}`)
      } else {
        logError(JSON.stringify(e, null, 2))
      }
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
    } else {
      spinner.fail("💔 Pinning to Infura didn't work.")
    }
  } catch (e) {
    spinner.fail("💔 Pinning to Infura didn't work.")
    logError(`${e.name}:\n${e.message}`)
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

  const { ipfsd, ipfsClient } = await getIpfsDaemonAndClient()

  const hash = await pinToLocalDaemon(ipfsClient, publicDirPath)

  if (remotePinners.includes('pinata')) {
    await pinToPinata(
      ipfsClient,
      credentials.pinata,
      { name: siteDomain },
      hash
    )
  }

  if (remotePinners.includes('infura')) {
    await pinToInfura(hash)
  }

  await stopIpfsDaemonIfDisposable(ipfsd)

  if (copyPublicGatewayUrlToClipboard) {
    copyUrlToClipboard(hash)
  }

  if (dnsProviders.includes('cloudflare')) {
    await updateCloudflareDns(siteDomain, credentials.cloudflare, hash)
  }

  if (open && _.isEmpty(dnsProviders)) await openUrl(publicGatewayUrl(hash))
  if (open && !_.isEmpty(dnsProviders)) await openUrl(`https://${siteDomain}`)

  return hash
}

module.exports = deploy
