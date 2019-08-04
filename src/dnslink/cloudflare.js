const updateCloudflareDnslink = require('dnslink-cloudflare')
const ora = require('ora')
const chalk = require('chalk')
const _ = require('lodash')
const fp = require('lodash/fp')

const { logError } = require('../logging')

const white = chalk.whiteBright

// returns (sub)domain deployed to or null when error
module.exports = async (
  siteDomain,
  { apiEmail, apiKey, zone, record },
  hash
) => {
  let result
  const spinner = ora()

  spinner.start(`📡  Beaming new hash to DNS provider ${white('Cloudflare')}…`)
  if (fp.some(_.isEmpty)([apiEmail, apiKey])) {
    spinner.fail('💔  Missing arguments for Cloudflare API.')
    spinner.warn('🧐  Check if these environment variables are present:')
    logError(`
      IPFS_DEPLOY_CLOUDFLARE__API_EMAIL
      IPFS_DEPLOY_CLOUDFLARE__API_KEY

      (Note the 2 '_' after "CLOUDFLARE".)
      You can put them in a .env file if you want and they will be picked up.
    `)
  }
  if (_.isEmpty(siteDomain) && fp.some(_.isEmpty)([zone, record])) {
    spinner.fail('💔  Missing arguments for Cloudflare API.')
    spinner.warn('🧐  Check if these environment variables are present:')
    logError(`
      IPFS_DEPLOY_CLOUDFLARE__ZONE
      IPFS_DEPLOY_CLOUDFLARE__RECORD

      (Note the 2 '_' after "CLOUDFLARE".)
      You can put them in a .env file if you want and they will be picked up.

      Example with top-level domain:
      IPFS_DEPLOY_CLOUDFLARE__ZONE=agentofuser.com
      IPFS_DEPLOY_CLOUDFLARE__RECORD=_dnslink.agentofuser.com

      Example with subdomain:
      IPFS_DEPLOY_CLOUDFLARE__ZONE=agentofuser.com
      IPFS_DEPLOY_CLOUDFLARE__RECORD=_dnslink.test.agentofuser.com
    `)
    result = null
  } else {
    const api = {
      email: apiEmail,
      key: apiKey
    }

    const opts = {
      zone: zone || siteDomain,
      record: record || `_dnslink.${siteDomain}`,
      link: `/ipfs/${hash}`
    }

    try {
      const content = await updateCloudflareDnslink(api, opts)
      spinner.succeed('🙌  SUCCESS!')
      spinner.info(`🔄  Updated DNS TXT ${white(opts.record)} to:`)
      spinner.info(`🔗  ${white(content)}`)

      result = opts.record
        .split('.')
        .slice(1)
        .join('.')
    } catch (e) {
      spinner.fail("💔  Updating Cloudflare DNS didn't work.")
      logError(e)
      result = null
    }
  }

  return result
}
