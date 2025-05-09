import IpfsNode from './ipfs-node.js'

export default class DAppNode extends IpfsNode {
  constructor () {
    super({
      host: 'ipfs.dappnode',
      port: 5001,
      protocol: 'http'
    })
  }

  static get displayName () {
    return 'DAppNode'
  }

  get displayName () {
    return DAppNode.displayName
  }

  static get slug () {
    return 'dappnode'
  }
}
