'use strict'

// @ts-ignore
const dnslink = require('dnslink-cloudflare')
const isEmpty = require('lodash.isempty')

const got = require('got')
class CloudflareWeb3GatewayClient {
  // @ts-ignore
  async getZoneId (api, name) {
    let res

    for (let i = 1; (res = await api(`zones?page=${i}`)) && res.body.result_info.total_pages >= i; i++) {
      for (const zone of res.body.result) {
        if (zone.name === name) {
          return zone.id
        }
      }
    }

    throw new Error(`zone ${name} couldn't be found`)
  }

  // https://api.cloudflare.com/#web3-hostname-list-web3-hostnames
  // @ts-ignore
  async getRecord (api, id, name) {
    const res = await api(`zones/${id}/web3/hostnames`)

    // @ts-ignore
    const record = res.body.result.find(r => r.name === name)

    return record
  }

  // @ts-ignore
  getClient (apiOpts) {
    const opts = {
      prefixUrl: 'https://api.cloudflare.com/client/v4',
      responseType: 'json'
    }

    if (apiOpts.token) {
      // @ts-ignore
      opts.headers = {
        Authorization: `Bearer ${apiOpts.token}`
      }
    } else {
      // @ts-ignore
      opts.headers = {
        'X-Auth-Email': apiOpts.email,
        'X-Auth-Key': apiOpts.key
      }
    }

    // @ts-ignore
    return got.extend(opts)
  }

  // @ts-ignore
  async update (apiOpts, { zone, link, record }) {
    const api = this.getClient(apiOpts)
    const id = await this.getZoneId(api, zone)
    const rec = await this.getRecord(api, id, record)

    if (!rec) {
      throw new Error(`web3 gw for ${record} couldn't be found, must be created first`)
    }

    await api.patch(`zones/${id}/web3/hostnames/${rec.id}`, {
      json: {
        dnslink: link
      }
    })

    return `dnslink=${link}`
  }
}

/**
 * @typedef {import('./types').DNSRecord} DNSRecord
 * @typedef {import('./types').CloudflareOptions} CloudflareOptions
 */

class Cloudflare {
  /**
   * @param {CloudflareOptions} options
   */
  constructor ({ apiEmail, apiKey, apiToken, zone, record, useWeb3Gw }) {
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

    this.opts = { record, zone, useWeb3Gw: Boolean(useWeb3Gw) }
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

    const content = this.opts.useWeb3Gw
      ? await (new CloudflareWeb3GatewayClient()).update(this.api, opts)
      : await dnslink(this.api, opts)

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

module.exports = Cloudflare
