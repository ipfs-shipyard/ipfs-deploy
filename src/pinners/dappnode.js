const IpfsNode = require('./ipfs-node')

class DAppNode extends IpfsNode {
  constructor () {
    super({
      host: 'ipfs.dappnode',
      port: '5001',
      protocol: 'http'
    })
  }

  static get name () {
    return 'DAppNode'
  }

  static get slug () {
    return 'dappnode'
  }
}

module.exports = DAppNode
