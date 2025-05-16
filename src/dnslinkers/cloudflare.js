'use strict'

// @ts-ignore
const dnslink = require('dnslink-cloudflare')
const isEmpty = require('lodash.isempty')
const getLinkedCid = require('../lib/cloudflareCid')

/**
 * @typedef {import('./types').DNSRecord} DNSRecord
 * @typedef {import('./types').CloudflareOptions} CloudflareOptions
 */

class Cloudflare {
  /**
   * @param {CloudflareOptions} options
   */
  constructor ({ apiEmail, apiKey, apiToken, zone, web3Hostname }) {
    if ([apiKey, apiEmail, apiToken].every(isEmpty)) {
      throw new Error('apiEmail and apiKey or apiToken are required for Cloudflare')
    }

    if ([zone, web3Hostname].some(isEmpty)) {
      throw new Error('zone and web3 hostname are required for CloudFlare')
    }

    if (isEmpty(apiKey)) {
      this.api = { token: apiToken }
    } else {
      this.api = {
        email: apiEmail,
        key: apiKey
      }
    }

    this.opts = { web3Hostname, zone }
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
      record: opts.web3Hostname,
      value: content
    }
  }

  /**
   * @returns {Promise<string|null>}
   */
  async getLinkedCid () {
    return getLinkedCid(this.api, this.opts)
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

module.exports = Cloudflare
