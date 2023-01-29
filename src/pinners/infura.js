import isString from 'lodash.isstring'
import IpfsNode from './ipfs-node.js'

/**
 * @typedef {import('ipfs-http-client').Options} IpfsOptions
 * @typedef {import('./types.js').InfuraOptions} InfuraOptions
 */

export default class Infura extends IpfsNode {
  /**
   * @param {InfuraOptions} options
   */
  constructor ({ projectId, projectSecret }) {
    /** @type {IpfsOptions} */
    const options = {
      host: 'ipfs.infura.io',
      port: 5001,
      protocol: 'https'
    }
    if ([projectId, projectSecret].every(isString)) {
      const authorization = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64')
      options.headers = { authorization }
    }
    super(options)
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
