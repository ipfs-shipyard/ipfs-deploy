import DAppNode from './dappnode.js'
import Infura from './infura.js'
import IpfsCluster from './ipfs-cluster.js'
import Pinata from './pinata.js'
import c4rex from './c4rex.js'
import Filebase from './filebase.js'

export const pinners = [
  DAppNode,
  Infura,
  IpfsCluster,
  Pinata,
  c4rex,
  Filebase
]

export const pinnersMap = pinners.reduce((map, pinner) => {
  map.set(pinner.slug, pinner)
  return map
}, new Map())
