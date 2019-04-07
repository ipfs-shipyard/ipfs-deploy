const util = require('util')
const IPFSFactory = require('ipfsd-ctl')
const which = require('which')
const clipboardy = require('clipboardy')
const pinataSDK = require('@pinata/sdk')
const got = require('got')
const updateCloudflareDnslink = require('dnslink-cloudflare')
const ora = require('ora')
const chalk = require('chalk')
const openUrl = require('open')
const _ = require('lodash')

// # Pure functions
function publicGatewayUrl(hash) {
  return `https://ipfs.io/ipfs/${hash}`
}

// Effectful functions

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
  const ipfsBinAbsPath =
    which.sync('ipfs', { nothrow: true }) ||
    which.sync('jsipfs', { nothrow: true })

  const df = IPFSFactory.create({ exec: ipfsBinAbsPath })

  const spinner = ora()
  spinner.start('☎️  Connecting to local IPFS daemon…')

  const spawn = util.promisify(df.spawn.bind(df))
  ipfsd = await spawn({ disposable: false, init: false, start: false })

  const start = util.promisify(ipfsd.start.bind(ipfsd))
  const ipfsClient = await start([])
  spinner.succeed('☎️  Connected to local IPFS daemon.')

  spinner.start('🔗 Pinning to local IPFS…')
  const localPinResult = await ipfsClient.addFromFs(publicDirPath, {
    recursive: true,
  })
  const { hash } = localPinResult[localPinResult.length - 1]
  spinner.succeed(`📌 Pinned locally as ${chalk.green(hash)}.`)

  if (!localPinOnly && remotePinners.includes('pinata')) {
    spinner.start(
      `📠 Requesting remote pin to ${chalk.whiteBright('pinata.cloud')}…`
    )
    const { addresses } = await ipfsClient.id()

    const publicMultiaddresses = addresses.filter(
      multiaddress =>
        !multiaddress.match(/\/::1\//) &&
        !multiaddress.match(/127\.0\.0\.1/) &&
        !multiaddress.match(/192\.168/)
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
    const infuraResponse = await got(
      `https://ipfs.infura.io:5001/api/v0/pin/add?arg=${hash}` +
        '&recursive=true'
    )

    if (infuraResponse.statusCode === 200) {
      spinner.succeed("📌 It's pinned to Infura now.")
    } else {
      spinner.fail("Pinning to Infura didn't work.")
    }
  }

  if (copyPublicGatewayUrlToClipboard)
    clipboardy.writeSync(publicGatewayUrl(hash))
  spinner.succeed('📋 Public gateway URL copied to clipboard.')

  if (dnsProviders.includes('cloudflare'))
    await updateCloudflareDns(siteDomain, credentials.cloudflare, hash)

  if (open && !localPinOnly && !_.isEmpty(dnsProviders))
    openUrl(`https://${siteDomain}`)
  if (open && (localPinOnly || _.isEmpty(dnsProviders)))
    openUrl(publicGatewayUrl(hash))
}

module.exports = deploy
