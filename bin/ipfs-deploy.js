#!/usr/bin/env node
const chalk = require('chalk')

const deploy = require('../index')

require('dotenv').config()

const argv = require('yargs')
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
          default: 'public',
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
          P: {
            alias: 'no-remote-pin',
            type: 'boolean',
            default: false,
            describe:
              "DON'T pin remotely, only to local daemon (overrides -p)",
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
        .example(
          '$0 -OCP docs',
          `# Pins path "${chalk.whiteBright('docs')}" to local daemon ` +
            'only and does nothing else. Same as ' +
            `${chalk.whiteBright('ipfs add -r docs')}`
        )
    }
  )
  .help()
  .alias('h', 'help').argv

async function main() {
  const deployOptions = {
    publicDirPath: argv.path,
    copyPublicGatewayUrlToClipboard: !argv.noClipboard,
    open: !argv.O,
    localPinOnly: argv.P,
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

  const hash = await deploy(deployOptions)
  process.stdout.write(`${hash}\n`)
}

main()
