const { create: ipfsHttp, globSource } = require('ipfs-http-client')
const all = require('it-all')
const path = require('path')

class IpfsNode {
  constructor (options) {
    this.ipfs = ipfsHttp(options)
  }

  async pinDir (dir, tag) {
    const response = await all(this.ipfs.addAll(globSource(dir, { recursive: true })))
    const basename = path.basename(dir)
    const root = response.find(({ path }) => path === basename)
    return root.cid.toString()
  }

  async pinCid (cid, tag) {
    await this.ipfs.pin.add(cid)
  }

  static get name () {
    return 'IPFS Node'
  }

  static get slug () {
    return 'ipfs-node'
  }

  static get gateway () {
    return 'https://ipfs.io'
  }
}

module.exports = IpfsNode
