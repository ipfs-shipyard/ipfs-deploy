'use strict'

const IpfsNode = require('./ipfs-node')

class Infura extends IpfsNode {
  constructor () {
    super({
      host: 'ipfs.infura.io',
      port: 5001,
      protocol: 'https'
    })
  }

  /**
   * @param {string} cid
   * @returns string
   */
  gatewayUrl (cid) {
    return `https://ipfs.infura.io/ipfs/${cid}`
  }

  static get displayName () {
    return 'Infura'
  }

  get displayName () {
    return Infura.displayName
  }

  static get slug () {
    return 'infura'
  }
}

module.exports = Infura
