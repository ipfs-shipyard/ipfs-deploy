const dnslink = require('dnslink-cloudflare')
const isEmpty = require('lodash.isempty')

class Cloudflare {
  constructor ({ apiEmail, apiKey, apiToken, zone, record } = {}) {
    if ([apiKey, apiEmail, apiToken].every(isEmpty)) {
      throw new Error('apiEmail and apiKey or apiToken are required for Cloudflare')
    }

    if ([zone, record].some(isEmpty)) {
      throw new Error('zone and record are required for CloudFlare')
    }

    this.api = {}

    if (isEmpty(apiKey)) {
      this.api.token = apiToken
    } else {
      this.api.email = apiEmail
      this.api.key = apiKey
    }

    this.opts = { record, zone }
  }

  async link (cid) {
    const opts = {
      ...this.opts,
      link: `/ipfs/${cid}`
    }

    const content = await dnslink(this.api, opts)

    return {
      record: opts.record,
      value: content
    }
  }

  static get name () {
    return 'Cloudflare'
  }

  static get slug () {
    return 'cloudflare'
  }
}

module.exports = Cloudflare
