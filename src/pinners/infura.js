const IpfsNode = require('./ipfs-node')

class Infura extends IpfsNode {
  constructor () {
    super({
      host: 'ipfs.infura.io',
      port: '5001',
      protocol: 'https'
    })
  }

  static get displayName () {
    return 'Infura'
  }

  static get slug () {
    return 'infura'
  }

  static get gateway () {
    return 'https://ipfs.infura.io'
  }
}

module.exports = Infura
