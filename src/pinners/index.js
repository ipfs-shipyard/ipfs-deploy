'use strict'

const DAppNode = require('./dappnode')
const Infura = require('./infura')
const IpfsCluster = require('./ipfs-cluster')
const Pinata = require('./pinata')
const c4rex = require('./c4rex')

const pinners = [
  DAppNode,
  Infura,
  IpfsCluster,
  Pinata,
  c4rex
]

const pinnersMap = pinners.reduce((map, pinner) => {
  map.set(pinner.slug, pinner)
  return map
}, new Map())

module.exports = {
  pinners,
  pinnersMap
}
