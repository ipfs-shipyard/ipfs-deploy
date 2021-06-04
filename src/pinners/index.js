'use strict'

const DAppNode = require('./dappnode')
const Fission = require('./fission')
const Infura = require('./infura')
const IpfsCluster = require('./ipfs-cluster')
const Pinata = require('./pinata')

const pinners = [
  DAppNode,
  Fission,
  Infura,
  IpfsCluster,
  Pinata
]

const pinnersMap = pinners.reduce((map, pinner) => {
  map.set(pinner.slug, pinner)
  return map
}, new Map())

module.exports = {
  pinners,
  pinnersMap
}
