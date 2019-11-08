const make = require('./maker')

module.exports = {
  infura: make(require('./infura')),
  pinata: make(require('./pinata')),
  ipfsCluster: make(require('./ipfs-cluster')),
  fission: make(require('./fission')),
  dappnode: make(require('./dappnode'))
}
