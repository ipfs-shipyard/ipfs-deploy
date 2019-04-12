const util = require('util')
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
const multiaddr = require('multiaddr')
const ip = require('ip')

// # Pure functions
function publicGatewayUrl(hash) {
  return `https://ipfs.io/ipfs/${hash}`
}

// Effectful functions

async function openUrl(url) {
  const spinner = ora()
  spinner.start('🏄 Opening web browser…')
  const childProcess = await doOpen(url)
  spinner.succeed('🏄 Opened web browser (call with -O to disable.)')
  return childProcess
}

async function updateCloudflareDns(siteDomain, { apiEmail, apiKey }, hash) {
  const spinner = ora()

  if (!apiKey || !apiEmail || !siteDomain || !hash) {
    throw new Error('Missing information for updateCloudflareDns()')
  }

  const api = {
    email: apiEmail,
    key: apiKey,
  }

  const opts = {
    record: siteDomain,
    zone: siteDomain,
    link: `/ipfs/${hash}`,
  }

  try {
    spinner.start(
      `📡 Beaming new hash to DNS provider ${chalk.whiteBright(
        'Cloudflare'
      )}...`
    )
    const content = await updateCloudflareDnslink(api, opts)
    spinner.succeed('🙌 SUCCESS!')
    spinner.info(`🔄 Updated DNS TXT ${chalk.whiteBright(opts.record)} to:`)
    spinner.info(`🔗 ${chalk.whiteBright(content)}.`)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }

  return siteDomain
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
    console.error(`${e.name}: ${e.message}`)
    process.exit(1)
  }
}

async function getIpfsDaemon() {
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
      ipfsd = await spawn({ disposable: true, init: true, start: false })
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
      ipfsd = await spawn({ disposable: true, init: true, start: false })
      const start = util.promisify(ipfsd.start.bind(ipfsd))
      ipfsClient = await start([])
      spinner.succeed('☎️  Connected to local disposable IPFS daemon.')
    } catch (e) {
      spinner.fail("💔 Couldn't start local disposable IPFS daemon.")
      console.error(`${e.name}: ${e.message}`)
      process.exit(1)
    }
  }

  return ipfsd
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

  spinner.start(
    `📠 Requesting remote pin to ${chalk.whiteBright('pinata.cloud')}…`
  )
  const { addresses } = await ipfsClient.id()
  const publicMultiaddresses = addresses.filter(
    multiaddress =>
      !ip.isPrivate(multiaddr(multiaddress).nodeAddress().address)
  )

  const pinataOptions = {
    host_nodes: publicMultiaddresses,
    pinataMetadata: metadata,
  }

  const pinata = pinataSDK(credentials.apiKey, credentials.secretApiKey)

  await pinata.pinHashToIPFS(hash, pinataOptions)

  spinner.succeed("📌 It's pinned to Pinata now.")
}

async function pinToInfura(hash) {
  const spinner = ora()

  spinner.start(
    `📠 Requesting remote pin to ${chalk.whiteBright('infura.io')}…`
  )

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
    console.error(`${e.name}: ${e.message}`)
  }
}

function copyUrlToClipboard(hash) {
  const spinner = ora()
  spinner.start('📋 Copying public gateway URL to clipboard…')
  clipboardy.writeSync(publicGatewayUrl(hash))
  spinner.succeed('📋 Copied public gateway URL to clipboard.')
  spinner.info(`${chalk.green(publicGatewayUrl(hash))}`)
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
  await showSize(publicDirPath)

  const ipfsd = await getIpfsDaemon()
  const ipfsClient = ipfsd.api

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
