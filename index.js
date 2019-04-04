const IPFSFactory = require('ipfsd-ctl')
const which = require('which')
const clipboardy = require('clipboardy')
const pinataSDK = require('@pinata/sdk')
const got = require('got')
const updateCloudflareDnslink = require('dnslink-cloudflare')
const ora = require('ora')
const chalk = require('chalk')
const openUrl = require('open')

require('dotenv').config()

async function doUpdateDns(hash) {
  const key = process.env.CF_API_KEY
  const email = process.env.CF_API_EMAIL
  const domain = process.env.SITE_DOMAIN

  const spinner = ora()

  if (!key || !email || !domain || !hash) {
    throw new Error('Missing information for doUpdateDns()')
  }

  const api = {
    key,
    email,
  }

  const opts = {
    record: domain,
    zone: domain,
    link: `/ipfs/${hash}`,
  }

  try {
    spinner.info(
      `📡 Beaming new hash to DNS provider ${chalk.whiteBright(
        'Cloudflare'
      )}...`
    )
    const content = await updateCloudflareDnslink(api, opts)
    spinner.succeed('🙌 SUCCESS!')
    spinner.info(`Updated TXT ${chalk.whiteBright(opts.record)} to:`)
    spinner.info(`${chalk.whiteBright(content)}.`)
    spinner.succeed('🌐 Your website is deployed now.')
  } catch (err) {
    console.log(err)
    process.exit(1)
  }
}

async function deploy({
  updateDns = true,
  open = false,
  // pinners = ['pinata', 'infura'], TODO
  // pinRemotely = true, TODO
  publicDirPath = 'public',
} = {}) {
  const ipfsBinAbsPath =
    which.sync('ipfs', { nothrow: true }) ||
    which.sync('jsipfs', { nothrow: true })

  const df = IPFSFactory.create({ exec: ipfsBinAbsPath })

  const spinner = ora()
  spinner.start()
  spinner.info('☎️ Connecting to local IPFS daemon...')

  df.spawn({ disposable: false, init: false, start: false }, (err, ipfsd) => {
    if (err) throw err

    ipfsd.start([], (err2, ipfsClient) => {
      if (err2) throw err2
      // spinner.succeed('📶 Connected.')

      spinner.info(
        `💾 Adding and pinning ${chalk.blue(publicDirPath)} locally...`
      )

      ipfsClient.addFromFs(
        publicDirPath,
        { recursive: true },
        (err3, localPinResult) => {
          if (err3) {
            spinner.fail(
              "☠  Couldn't connect to local ipfs daemon. Is it running?"
            )
            throw err3
          }

          const { hash } = localPinResult[localPinResult.length - 1]
          spinner.succeed(`🔗 Added locally as ${chalk.green(hash)}.`)

          ipfsClient.id((err4, { addresses }) => {
            if (err4) throw err4

            const publicMultiaddresses = addresses.filter(
              multiaddress =>
                !multiaddress.match(/\/::1\//) &&
                !multiaddress.match(/127\.0\.0\.1/) &&
                !multiaddress.match(/192\.168/)
            )

            const pinataOptions = {
              host_nodes: publicMultiaddresses,
              pinataMetadata: {
                name: process.env.SITE_DOMAIN,
                keyvalues: {
                  gitCommitHash: 'TODO',
                },
              },
            }

            const pinata = pinataSDK(
              process.env.PINATA_API_KEY,
              process.env.PINATA_SECRET_API_KEY
            )

            spinner.info(
              `📠 Requesting remote pin to ${chalk.whiteBright(
                'pinata.cloud'
              )}...`
            )
            pinata
              .pinHashToIPFS(hash, pinataOptions)
              .then(async _pinataPinResult => {
                spinner.succeed("📌 It's pinned to Pinata now.")

                try {
                  spinner.info(
                    `📠 Requesting remote pin to ${chalk.whiteBright(
                      'infura.io'
                    )}.`
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
                } catch (e) {
                  console.error(e)
                }

                clipboardy.writeSync(hash)
                spinner.succeed(
                  `📋 Hash ${chalk.green(hash)} copied to clipboard.`
                )

                if (updateDns) doUpdateDns(hash)

                if (open) openUrl(`https://${process.env.SITE_DOMAIN}`)
              })
              .catch(err5 => {
                throw err5
              })
          })
        }
      )
    })
  })
}

module.exports = deploy
