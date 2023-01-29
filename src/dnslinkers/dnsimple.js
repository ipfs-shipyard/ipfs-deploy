// @ts-ignore
import dnslink from 'dnslink-dnsimple'
import isEmpty from 'lodash.isempty'

/**
 * @typedef {import('./types.js').DNSRecord} DNSRecord
 * @typedef {import('./types.js').DNSimpleOptions} DNSimpleOptions
 */

export default class DNSimple {
  /**
   * @param {DNSimpleOptions} options
   */
  constructor ({ token, zone, record }) {
    if (isEmpty(token)) {
      throw new Error('token is required for DNSimple')
    }

    if ([zone, record].some(isEmpty)) {
      throw new Error('zone and record are required for DNSimple')
    }

    this.token = token
    this.zone = zone
    this.record = record
  }

  /**
   * @param {string} cid
   * @returns {Promise<DNSRecord>}
   */
  async link (cid) {
    const recordWithoutZone = this.record.replace(`.${this.zone}`, '')

    const flags = {
      domain: this.zone,
      record: recordWithoutZone,
      link: `/ipfs/${cid}`,
      ttl: 60
    }

    const {
      record: { content }
    } = await dnslink(this.token, flags)

    return {
      record: `${recordWithoutZone}.${this.zone}`,
      value: content
    }
  }

  static get displayName () {
    return 'DNSimple'
  }

  get displayName () {
    return DNSimple.displayName
  }

  static get slug () {
    return 'dnsimple'
  }
}
