#!/usr/bin/env node

// @ts-nocheck

/* eslint-disable no-console */
'use strict'

const updateNotifier = require('update-notifier')
const yargs = require('yargs')
const dotenv = require('dotenv')

const { deploy, dnsLinkersMap, pinnersMap } = require('.')
const pkg = require('../package.json')

const dnsProviders = [...dnsLinkersMap.keys()]
const pinningServices = [...pinnersMap.keys()]

updateNotifier({ pkg, updateCheckInterval: 0 }).notify()
dotenv.config()

const argv = yargs
  .scriptName('ipfs-deploy')
  .usage(
    '$0 [path] [options]',
    'Upload static websites to IPFS pinning services and, optionally, update your DNS. Prints the CID to stdout so you can easily pipe into other programs.',
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
            describe: 'DO NOT copy the Gateway URL to the clipboard',
            type: 'boolean',
            default: false
          },
          o: {
            alias: 'open',
            describe: 'Open all Gateway URLs after deploying',
            type: 'boolean',
            default: false
          },
          t: {
            alias: 'tag',
            describe: 'Used as tag in some pinning services'
          },
          u: {
            alias: 'upload',
            choices: pinningServices,
            describe: 'Upload to this pinning services. If -p is set, only these services are used to upload'
          },
          p: {
            alias: 'pinner',
            choices: pinningServices,
            describe: 'Pin to this services. If -u is set, these services are only used to pin and not upload. Defaults to "infura" if neither -u or -p are set.'
          },
          d: {
            alias: 'dns',
            choices: dnsProviders,
            describe: 'DNS provider whose dnslink TXT field will be updated'
          },
          c: {
            alias: 'cid',
            describe: 'Pin this CID instead of uploading'
          },
          q: {
            alias: 'quiet',
            describe: 'Only print the CID in the end',
            type: 'boolean',
            default: false
          },
          H: {
            alias: 'hidden',
            describe: 'Add hidden (dot) files to IPFS',
            type: 'boolean',
            default: false
          }
        })
        .example(
          '$0',
          'Uploads and pins "public" to Infura and does not update DNS'
        )
        .example(
          '$0 -p pinata _site',
          'Uploads and pins "_site" to Pinata and does not update DNS'
        )
        .example(
          '$0 -p infura -p pinata -d cloudflare _site',
          'Uploads and pins "_site" to Pinata and Infura and updates Cloudflare DNS'
        )
        .example(
          '$0 -u pinata -p infura -d cloudflare _site',
          'Uploads "_site" to Pinata and pins the returning CID to Infura and updates Cloudflare DNS'
        )
        .example(
          '$0 -c QmHash -p pinata -d cloudflare',
          'Pins QmHash to Pinata and updates Cloudflare DNS'
        )
    }
  )
  .help()
  .alias('h', 'help')
  .argv

const arrayFromString = o => typeof o === 'string' ? [o] : o

const options = {
  dir: argv.path,
  tag: argv.tag,
  cid: argv.cid,

  copyUrl: !argv.C,
  openUrls: argv.open,
  hiddenFiles: argv.hidden,

  uploadServices: arrayFromString(argv.upload),
  pinningServices: arrayFromString(argv.pinner),
  dnsProviders: arrayFromString(argv.dns),

  dnsProvidersCredentials: {
    cloudflare: {
      apiKey: argv.cloudflare && argv.cloudflare.apiKey,
      apiToken: argv.cloudflare && argv.cloudflare.apiToken,
      apiEmail: argv.cloudflare && argv.cloudflare.apiEmail,
      zone: argv.cloudflare && argv.cloudflare.zone,
      record: argv.cloudflare && argv.cloudflare.record
    },
    route53: {
      accessKeyId: argv.route53 && argv.route53.accessKeyId,
      secretAccessKey: argv.route53 && argv.route53.secretAccessKey,
      region: argv.route53 && argv.route53.region,
      hostedZoneId: argv.route53 && argv.route53.hostedZoneId,
      record: argv.route53 && argv.route53.record
    },
    dnsimple: {
      token: argv.dnsimple && argv.dnsimple.token,
      zone: argv.dnsimple && argv.dnsimple.zone,
      record: argv.dnsimple && argv.dnsimple.record
    },
    dreamhost: {
      key: argv.dreamhost && argv.dreamhost.key,
      zone: argv.dreamhost && argv.dreamhost.zone,
      record: argv.dreamhost && argv.dreamhost.record
    }
  },

  pinningServicesCredentials: {
    pinata: {
      apiKey: argv.pinata && argv.pinata.apiKey,
      secretApiKey: argv.pinata && argv.pinata.secretApiKey
    },
    'ipfs-cluster': {
      host: argv.ipfsCluster && argv.ipfsCluster.host,
      username: argv.ipfsCluster && argv.ipfsCluster.username,
      password: argv.ipfsCluster && argv.ipfsCluster.password
    }
  },

  logger: {
    info: argv.quiet ? () => {} : console.error,
    error: console.error,
    out: console.log
  }
}

if (!options.uploadServices && !options.pinningServices) {
  options.pinningServices = ['infura']
}

async function main () {
  try {
    await deploy(options)
  } catch (e) {
    options.logger.error('❌  An error has occurred:\n')
    options.logger.error(e.stack || e.toString())
    process.exit(1)
  }
}

main()
