#!/usr/bin/env node
const updateNotifier = require('update-notifier')
const chalk = require('chalk')
const yargs = require('yargs')
const deploy = require('../src')
const pkg = require('../package.json')

updateNotifier({ pkg, updateCheckInterval: 0 }).notify()

require('dotenv').config()

const pinProviders = ['pinata', 'infura', 'ipfs-cluster']

const dnsProviders = ['cloudflare']

const argv = yargs
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
          normalize: true
        })
        .env('IPFS_DEPLOY')
        .options({
          C: {
            alias: 'no-clipboard',
            describe: "DON'T copy ipfs.io/ipfs/<hash> to clipboard"
          },
          d: {
            alias: 'dns',
            choices: dnsProviders,
            array: true,
            describe: 'DNS provider whose dnslink TXT field will be updated'
          },
          O: {
            alias: 'no-open',
            describe: "DON'T open URL after deploying"
          },
          p: {
            alias: 'pinner',
            choices: pinProviders,
            default: ['infura'],
            array: true,
            describe: `Pinning services to which ${chalk.whiteBright(
              'path'
            )} will be uploaded`
          },
          u: {
            alias: 'unique-upload',
            choices: pinProviders,
            describe: 'Upload to only one service and pin hash on others'
          }
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
  .argv

async function main () {
  const deployOptions = {
    publicDirPath: argv.path,
    copyHttpGatewayUrlToClipboard:
      !(argv.clipboard === false) && !argv.C && !argv.noClipboard,
    open: !(argv.open === false) && !argv.O && !argv.noOpen,
    remotePinners: argv.pinner,
    dnsProviders: argv.dns,
    siteDomain: argv.siteDomain,
    uniqueUpload: argv.uniqueUpload,
    credentials: {
      cloudflare: {
        apiKey: argv.cloudflare && argv.cloudflare.apiKey,
        apiEmail: argv.cloudflare && argv.cloudflare.apiEmail,
        zone: argv.cloudflare && argv.cloudflare.zone,
        record: argv.cloudflare && argv.cloudflare.record
      },
      pinata: {
        apiKey: argv.pinata && argv.pinata.apiKey,
        secretApiKey: argv.pinata && argv.pinata.secretApiKey
      },
      ipfsCluster: {
        host: argv.ipfsCluster && argv.ipfsCluster.host,
        username: argv.ipfsCluster && argv.ipfsCluster.username,
        password: argv.ipfsCluster && argv.ipfsCluster.password
      }
    }
  }

  const pinnedHash = await deploy(deployOptions)
  if (pinnedHash) {
    process.stdout.write(pinnedHash + '\n')
  } else {
    process.exit(1)
  }
}

main()
