const updateCloudflareDnslink = require('dnslink-cloudflare')
const _ = require('lodash')
const fp = require('lodash/fp')

module.exports = {
  name: 'Cloudflare',
  validate: ({ apiEmail, apiKey, zone, record }) => {
    if (fp.some(_.isEmpty)([apiEmail, apiKey])) {
      throw new Error(`
        Missing the following environment variables:

        IPFS_DEPLOY_CLOUDFLARE__API_EMAIL
        IPFS_DEPLOY_CLOUDFLARE__API_KEY
  
        (Note the 2 '_' after "CLOUDFLARE".)
        You can put them in a .env file if you want and they will be picked up.
      `)
    }

    if (fp.some(_.isEmpty)([zone, record])) {
      throw new Error(`
        Missing the following environment variables:

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
