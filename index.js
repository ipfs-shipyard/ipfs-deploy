const util = require('util')
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
    spinner.succeed('🌎 Your website is deployed now.')
  } catch (err) {
    console.error(err)
    process.exit(1)
  }

  return siteDomain
}

async function deploy({
  publicDirPath,
  copyPublicGatewayUrlToClipboard = false,
  open = false,
  localPinOnly = false,
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
  const spinner = ora()

  const ipfsBinAbsPath =
    which.sync('ipfs', { nothrow: true }) ||
    which.sync('jsipfs', { nothrow: true })

  let ipfsd
  let ipfsClient
  let killDaemonAfterDone = false

  if (ipfsBinAbsPath) {
    spinner.start('☎️  Connecting to local IPFS daemon…')
    const type = ipfsBinAbsPath.match(/jsipfs/) ? 'js' : 'go'
    const df = IPFSFactory.create({ type, exec: ipfsBinAbsPath })
    const spawn = util.promisify(df.spawn.bind(df))
    ipfsd = await spawn({ disposable: false, init: false, start: false })
    if (!ipfsd.started) {
      const start = util.promisify(ipfsd.start.bind(ipfsd))
      spinner.start('☎️  Starting local IPFS daemon…')
      try {
        ipfsClient = await start([])
        killDaemonAfterDone = true
        spinner.succeed('☎️ Connected to local IPFS daemon.')
      } catch (e) {
        spinner.fail("💔 Can't connect to local IPFS daemon.")
        console.warn(`${e.name}: ${e.message}`)
      }
    }
  }

  if (!ipfsClient) {
    spinner.start('⏲️  Starting temporary IPFS daemon…\n')
    const df = IPFSFactory.create({ type: 'js' })
    const spawn = util.promisify(df.spawn.bind(df))
    try {
      ipfsd = await spawn({ disposable: true, init: true, start: false })
      const start = util.promisify(ipfsd.start.bind(ipfsd))
      ipfsClient = await start([])
      killDaemonAfterDone = true
      spinner.succeed('☎️  Connected to temporary IPFS daemon.')
    } catch (e) {
      spinner.fail("💔 Couldn't start temporary IPFS daemon.")
      console.error(`${e.name}: ${e.message}`)
      process.exit(1)
    }
  }

  spinner.start('🔗 Pinning to local IPFS…')
  const localPinResult = await ipfsClient.addFromFs(publicDirPath, {
    recursive: true,
  })
  const { hash } = localPinResult[localPinResult.length - 1]
  spinner.succeed(
    `📌 Pinned ${chalk.blue(publicDirPath)} locally as ${chalk.green(hash)}.`
  )

  if (!localPinOnly && remotePinners.includes('pinata')) {
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
      pinataMetadata: {
        name: siteDomain,
        // keyvalues: {
        //   gitCommitHash: 'TODO',
        // },
      },
    }

    const pinata = pinataSDK(
      credentials.pinata.apiKey,
      credentials.pinata.secretApiKey
    )

    await pinata.pinHashToIPFS(hash, pinataOptions)

    spinner.succeed("📌 It's pinned to Pinata now.")
  }

  if (!localPinOnly && remotePinners.includes('infura')) {
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

  if (killDaemonAfterDone) {
    const stop = util.promisify(ipfsd.stop.bind(ipfsd))
    // spinner.start('✋️ Stopping IPFS daemon…')
    await stop()
    // spinner.succeed('✋️ Stopped IPFS daemon.')
  }

  if (copyPublicGatewayUrlToClipboard) {
    spinner.start('📋 Copying public gateway URL to clipboard…')
    clipboardy.writeSync(publicGatewayUrl(hash))
    spinner.succeed('📋 Copied public gateway URL to clipboard.')
  }

  if (dnsProviders.includes('cloudflare'))
    await updateCloudflareDns(siteDomain, credentials.cloudflare, hash)

  if (open && !localPinOnly && !_.isEmpty(dnsProviders))
    await openUrl(`https://${siteDomain}`)
  if (open && (localPinOnly || _.isEmpty(dnsProviders)))
    await openUrl(publicGatewayUrl(hash))

  return hash
}

module.exports = deploy
