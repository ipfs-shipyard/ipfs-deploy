const updateCloudflareDnslink = require('dnslink-cloudflare')
const _ = require('lodash')
const fp = require('lodash/fp')

module.exports = {
  name: 'Cloudflare',
  validate: ({ apiEmail, apiKey, zone, record } = {}) => {
    if (fp.some(_.isEmpty)([apiEmail, apiKey])) {
      throw new Error(`Missing the following environment variables:

IPFS_DEPLOY_CLOUDFLARE__API_EMAIL
IPFS_DEPLOY_CLOUDFLARE__API_KEY`)
    }

    if (fp.some(_.isEmpty)([zone, record])) {
      throw new Error(`Missing the following environment variables:

IPFS_DEPLOY_CLOUDFLARE__ZONE
IPFS_DEPLOY_CLOUDFLARE__RECORD`)
    }
  },
  link: async (domain, hash, { apiEmail, apiKey, zone, record }) => {
    const api = {
      email: apiEmail,
      key: apiKey
    }

    const opts = {
      zone: zone || domain,
      record: record || `_dnslink.${domain}`,
      link: `/ipfs/${hash}`
    }

    const content = await updateCloudflareDnslink(api, opts)

    return {
      record: opts.record,
      value: content
    }
  }
}
