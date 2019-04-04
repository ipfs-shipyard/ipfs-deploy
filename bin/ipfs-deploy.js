#!/usr/bin/env node
const chalk = require('chalk')

const deploy = require('../index')

const argv = require('yargs')
  .scriptName('ipfs-deploy')
  .usage(
    '$0 [options] path',
    'Pin path locally, upload to pinning service, and update DNS',
    yargs => {
      yargs
        .positional('path', {
          type: 'string',
          default: './public/',
          describe: 'The path to deploy',
        })
        .options({
          D: {
            type: 'boolean',
            default: false,
            describe: "DON'T update Cloudflare DNS' TXT dnslink",
          },
          o: {
            type: 'boolean',
            default: false,
            describe: 'Open URL after deploying',
          },
          p: {
            alias: 'pinner',
            choices: ['pinata', 'infura'],
            default: ['pinata', 'infura'],
            describe: `Pinning services to which ${chalk.whiteBright(
              'path'
            )} will be uploaded`,
          },
          P: {
            type: 'boolean',
            default: false,
            describe:
              "DON'T pin remotely, only to local daemon (overrides -p)",
          },
        })
        .example(
          '$0 _site',
          `# Deploys path "${chalk.whiteBright(
            '_site'
          )}" to ${chalk.whiteBright('pinata')} and ${chalk.whiteBright(
            'infura'
          )}, and updates ${chalk.whiteBright('cloudflare')} DNS`
        )
        .example(
          '$0 -p infura -p pinata',
          `# Deploys path "${chalk.whiteBright(
            './public/'
          )}" to ${chalk.whiteBright('pinata')} and ${chalk.whiteBright(
            'infura'
          )}, and updates ${chalk.whiteBright('cloudflare')} DNS`
        )
        .example(
          '$0 -p pinata static',
          `# Deploys path "${chalk.whiteBright(
            'static'
          )}" ONLY to ${chalk.whiteBright(
            'pinata'
          )} and updates ${chalk.whiteBright('cloudflare')} DNS`
        )
        .example(
          '$0 -D docs',
          `# Deploys path "${chalk.whiteBright(
            'docs'
          )}" to ${chalk.whiteBright('pinata')} and ${chalk.whiteBright(
            'infura'
          )}, and ${chalk.whiteBright("DON'T")} update DNS`
        )
    }
  )
  .help().argv

function main() {
  deploy({
    updateDns: !argv.D,
    open: argv.o,
    // pinners: argv.p, TODO
    // pinRemotely: !argv.P, TODO
    publicDirPath: argv.path,
  })
}

main()
