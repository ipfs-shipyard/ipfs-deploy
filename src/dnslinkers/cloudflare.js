// @ts-ignore
import dnslink from 'dnslink-cloudflare'
import isEmpty from 'lodash.isempty'

/**
 * @typedef {import('./types.js').DNSRecord} DNSRecord
 * @typedef {import('./types.js').CloudflareOptions} CloudflareOptions
 */

export default class Cloudflare {
  /**
   * @param {CloudflareOptions} options
   */
  constructor ({ apiEmail, apiKey, apiToken, zone, record }) {
    if ([apiKey, apiEmail, apiToken].every(isEmpty)) {
      throw new Error('apiEmail and apiKey or apiToken are required for Cloudflare')
    }

    if ([zone, record].some(isEmpty)) {
      throw new Error('zone and record are required for CloudFlare')
    }

    if (isEmpty(apiKey)) {
      this.api = { token: apiToken }
    } else {
      this.api = {
        email: apiEmail,
        key: apiKey
      }
    }

    this.opts = { record, zone }
  }

  /**
   * @param {string} cid
   * @returns {Promise<DNSRecord>}
   */
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

  static get displayName () {
    return 'Cloudflare'
  }

  get displayName () {
    return Cloudflare.displayName
  }

  static get slug () {
    return 'cloudflare'
  }
}
