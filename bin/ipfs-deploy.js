#!/usr/bin/env node
const updateNotifier = require('update-notifier')
const colors = require('colors/safe')
const yargs = require('yargs')
const deploy = require('../src')
const pkg = require('../package.json')

updateNotifier({ pkg, updateCheckInterval: 0 }).notify()

require('dotenv').config()

const pinProviders = ['pinata', 'infura', 'ipfs-cluster', 'fission', 'dappnode']

const dnsProviders = ['cloudflare', 'dnsimple']

const argv = yargs
  .scriptName('ipfs-deploy')
  .usage(
    '$0 [path] [options]',
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
            describe: `Pinning services to which ${colors.brightWhite(
              'path'
            )} will be uploaded`
          },
          s: {
            alias: 'site-domain',
            describe: 'Can be used as pin name in pinning services'
          },
          u: {
            alias: 'unique-upload',
            choices: pinProviders,
            describe: 'Upload to only one service and pin hash on others'
          }
        })
        .example(
          '$0',
          `# Deploys relative path "${colors.brightWhite('public')}" to
            ${colors.brightWhite('ipfs.infura.io/ipfs/<hash>')}; doesn't ` +
            'update DNS; copies and opens URL. These defaults are chosen ' +
            'so as not to require signing up for any service or ' +
            'setting up environment variables on default use.'
        )
        .example(
          '$0 -p pinata _site',
          `# Deploys path "${colors.brightWhite(
            '_site'
          )}" ONLY to ${colors.brightWhite('pinata')} and doesn't update DNS`
        )
        .example(
          '$0 -p infura -p pinata -d cloudflare',
          `# Deploys path "${colors.brightWhite(
            'public'
          )}" to ${colors.brightWhite('pinata')} and ${colors.brightWhite(
            'infura'
          )}, and updates cloudflare DNS`
        )
    }
  )
  .help()
  .alias('h', 'help')
  .argv

async function main () {
  const options = {
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
        apiToken: argv.cloudflare && argv.cloudflare.apiToken,
        apiEmail: argv.cloudflare && argv.cloudflare.apiEmail,
        zone: argv.cloudflare && argv.cloudflare.zone,
        record: argv.cloudflare && argv.cloudflare.record
      },
      dnsimple: {
        token: argv.dnsimple && argv.dnsimple.token,
        zone: argv.dnsimple && argv.dnsimple.zone,
        record: argv.dnsimple && argv.dnsimple.record
      },
      pinata: {
        apiKey: argv.pinata && argv.pinata.apiKey,
        secretApiKey: argv.pinata && argv.pinata.secretApiKey
      },
      ipfsCluster: {
        host: argv.ipfsCluster && argv.ipfsCluster.host,
        username: argv.ipfsCluster && argv.ipfsCluster.username,
        password: argv.ipfsCluster && argv.ipfsCluster.password
      },
      fission: {
        username: argv.fission && argv.fission.username,
        password: argv.fission && argv.fission.password
      }
    }
  }

  if (typeof options.dnsProviders === 'string') {
    options.dnsProviders = [options.dnsProviders]
  }

  if (typeof options.remotePinners === 'string') {
    options.remotePinners = [options.remotePinners]
  }

  const pinnedHash = await deploy(options)
  if (pinnedHash) {
    process.stdout.write(pinnedHash + '\n')
  } else {
    process.exit(1)
  }
}

main()
