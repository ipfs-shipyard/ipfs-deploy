const dnslink = require('dnslink-dnsimple')
const _ = require('lodash')
const fp = require('lodash/fp')

module.exports = {
  name: 'DNSimple',
  validate: ({ token, zone, record } = {}) => {
    if (_.isEmpty(token)) {
      throw new Error(`Missing the following environment variables:

IPFS_DEPLOY_DNSIMPLE__TOKEN`)
    }

    if (fp.some(_.isEmpty)([zone, record])) {
      throw new Error(`Missing the following environment variables:
  
IPFS_DEPLOY_DNSIMPLE__ZONE
IPFS_DEPLOY_DNSIMPLE__RECORD`)
    }
  },
  link: async (_domain, hash, { token, zone, record }) => {
    const recordWithoutZone = record.replace(`.${zone}`, '')

    const flags = {
      domain: zone,
      record: recordWithoutZone,
      link: `/ipfs/${hash}`,
      ttl: 60
    }

    const {
      record: { content }
    } = await dnslink(token, flags)

    return {
      record: `${recordWithoutZone}.${zone}`,
      value: content
    }
  }
}
