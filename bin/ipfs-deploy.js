#!/usr/bin/env node
const chalk = require('chalk')
const yargs = require('yargs')

const deploy = require('../index')

require('dotenv').config()

const parser = yargs
  .scriptName('ipfs-deploy')
  .usage(
    '$0 [options] [path]',
    'Pin path locally, upload to pinning service, and update DNS\n\n' +
      'Prints hash (CID) to stdout so you can pipe to other programs',
    yargs => {
      yargs
        .positional('path', {
          type: 'string',
          describe: 'The local directory or file to be deployed',
          normalize: true,
        })
        .env('IPFS_DEPLOY')
        .options({
          C: {
            alias: 'no-clipboard',
            describe: "DON'T copy ipfs.io/ipfs/<hash> to clipboard",
          },
          d: {
            alias: 'dns',
            choices: ['cloudflare'],
            describe: 'DNS provider whose dnslink TXT field will be updated',
          },
          O: {
            type: 'boolean',
            describe: "DON'T open URL after deploying",
          },
          p: {
            alias: 'pinner',
            choices: ['pinata', 'infura'],
            default: ['infura'],
            describe: `Pinning services to which ${chalk.whiteBright(
              'path'
            )} will be uploaded`,
          },
          port: {
            default: '4002',
            describe:
              'Externally reachable port for pinners to connect to ' +
              'local IPFS node',
          },
        })
        .example(
          '$0',
          `# Deploys relative path "${chalk.whiteBright('public')}" to
            ${chalk.whiteBright('ipfs.infura.io/ipfs/<hash>')}; doesn't ` +
            'update DNS; copies and opens URL. These defaults are chosen ' +
            'so as not to require signing up for any service or ' +
            'setting up environment variables on default use.'
        )
        .example(
          '$0 -p pinata _site',
          `# Deploys path "${chalk.whiteBright(
            '_site'
          )}" ONLY to ${chalk.whiteBright('pinata')} and doesn't update DNS`
        )
        .example(
          '$0 -p infura -p pinata -d cloudflare',
          `# Deploys path "${chalk.whiteBright(
            'public'
          )}" to ${chalk.whiteBright('pinata')} and ${chalk.whiteBright(
            'infura'
          )}, and updates cloudflare DNS`
        )
    }
  )
  .help()
  .alias('h', 'help')

async function main() {
  const processArgv = process.argv.slice(1)
  const yargsParse = new Promise((resolve, reject) => {
    parser.parse(processArgv, (err, argv, output) => {
      if (err) {
        reject(err)
      } else {
        resolve({ argv, output })
      }
    })
  })

  const { argv, output } = await yargsParse

  const deployOptions = {
    publicDirPath: argv.path,
    copyHttpGatewayUrlToClipboard: !argv.noClipboard,
    open: !argv.O,
    port: argv.port,
    remotePinners: argv.p,
    dnsProviders: argv.d,
    siteDomain: argv.siteDomain,
    credentials: {
      cloudflare: {
        apiKey: argv.cloudflare && argv.cloudflare.apiKey,
        apiEmail: argv.cloudflare && argv.cloudflare.apiEmail,
      },
      pinata: {
        apiKey: argv.pinata && argv.pinata.apiKey,
        secretApiKey: argv.pinata && argv.pinata.secretApiKey,
      },
    },
  }

  process.stdout.write(output)

  if (argv.h) {
    // Had to do this because couldn't get yargs#epilogue() to work
    process.stdout.write(`
  For help or more information, ping me at
  https://twitter.com/${chalk.whiteBright('agentofuser')}
    `)
  } else {
    const pinnedHash = await deploy(deployOptions)
    if (!pinnedHash) {
      process.exit(1)
    }
  }
}

;(async () => {
  await main()
})()
