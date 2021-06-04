'use strict'

// @ts-ignore
const DreamHostClient = require('dreamhost')
const isEmpty = require('lodash.isempty')

/**
 * @typedef {import('./types').DNSRecord} DNSRecord
 * @typedef {import('./types').DreamHostOptions} DreamHostOptions
 */

class DreamHost {
  /**
   * @param {DreamHostOptions} options
   */
  constructor ({ key, record }) {
    if ([key, record].some(isEmpty)) {
      throw new Error('key and record are required for DreamHost')
    }

    this.record = record
    this.client = new DreamHostClient({ key })
  }

  /**
   * @param {string} cid
   * @returns {Promise<DNSRecord>}
   */
  async link (cid) {
    const link = `/ipfs/${cid}`

    const options = {
      type: 'TXT',
      record: this.record,
      value: link,
      comment: 'Added by ipfs-deploy.'
    }

    const records = await this.client.dns.listRecords()
    // @ts-ignore
    const forDomain = records.filter(o => {
      return (o.record === options.record &&
        o.type === options.type &&
        o.value.startsWith('/ipfs/'))
    })

    for (const o of forDomain) {
      await this.client.dns.removeRecord({
        type: o.type,
        record: o.record,
        value: o.value
      })
    }

    // Sometimes the deletes take a little while to settle.
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.client.dns
          .addRecord(options)
          .then(() => {
            resolve({
              record: options.record,
              value: options.value
            })
          })
          .catch(reject)
      }, 100)
    })
  }

  static get displayName () {
    return 'DreamHost'
  }

  get displayName () {
    return DreamHost.displayName
  }

  static get slug () {
    return 'dreamhost'
  }
}

module.exports = DreamHost
