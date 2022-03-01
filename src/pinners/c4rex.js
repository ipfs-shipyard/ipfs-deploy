'use strict'

const IpfsNode = require('./ipfs-node')

class c4rex extends IpfsNode {
  constructor () {
    super({
      host: 'api.ipfs.c4rex.co',
      port: 443,
      protocol: 'https',
      headers: {
        Authorization: `Basic ${Buffer.from('api-ipfs:4PIUS3R').toString('base64')}`
      }
    })
  }

  /**
   * @param {string} cid
   * @returns string
   */
  gatewayUrl (cid) {
    return `https://c4rex.co/ipfs/${cid}`
  }

  static get displayName () {
    return 'C4REX'
  }

  get displayName () {
    return c4rex.displayName
  }

  static get slug () {
    return 'c4rex'
  }
}

module.exports = c4rex
