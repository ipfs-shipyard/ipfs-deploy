import { create as ipfsHttp, globSource } from 'ipfs-http-client'
import all from 'it-all'

/**
 * @typedef {import('ipfs-http-client').Options} IpfsOptions
 * @typedef {import('./types.js').PinDirOptions} PinDirOptions
 */

export default class IpfsNode {
  /**
   * @param {IpfsOptions} options
   */
  constructor (options) {
    this.ipfs = ipfsHttp(options)
  }

  /**
   * @param {string} dir
   * @param {PinDirOptions|undefined} options
   * @returns {Promise<string>}
   */
  async pinDir (dir, { tag, hidden = false } = {}) {
    const response = await all(this.ipfs.addAll(
      (async function * () {
        for await (const file of globSource(dir, '**/*', { hidden })) {
          yield {
            ...file,
            path: 'upload' + file.path
          }
        }
      })()
    ))
    const root = response.find(({ path }) => path === 'upload')

    if (!root) {
      throw new Error('could not determine the CID')
    }

    return root.cid.toString()
  }

  /**
   * @param {string} cid
   * @param {string|undefined} tag
   * @returns {Promise<void>}
   */
  async pinCid (cid, tag) {
    await this.ipfs.pin.add(cid)
  }

  /**
   * @param {string} cid
   * @returns string
   */
  gatewayUrl (cid) {
    return `https://ipfs.io/ipfs/${cid}`
  }

  static get displayName () {
    return 'IPFS Node'
  }

  get displayName () {
    return IpfsNode.displayName
  }

  static get slug () {
    return 'ipfs-node'
  }
}
