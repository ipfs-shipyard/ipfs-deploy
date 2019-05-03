function getGatewayUrl(cid, gatewayProvider = 'ipfs') {
  if (!cid) {
    throw new Error('getGatewayUrl expects to be called with a valud IPFS CID')
  }
  const gateways = {
    ipfs: 'https://ipfs.io',
    infura: 'https://ipfs.infura.io',
    pinata: 'https://gateway.pinata.cloud',
  }
  const origin = gateways[gatewayProvider] || gateways['ipfs']
  return `${origin}/ipfs/${cid}`
}

module.exports = getGatewayUrl
