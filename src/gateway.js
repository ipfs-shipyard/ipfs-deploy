function getGatewayUrl(cid, gatewayProvider = 'ipfs') {
  const gateways = {
    ipfs: 'https://ipfs.io',
    infura: 'https://ipfs.infura.io',
    pinata: 'https://gateway.pinata.cloud',
    fission: 'https://ipfs.runfission.com',
  }
  const origin = gateways[gatewayProvider] || gateways['ipfs']
  if (!cid) {
    return origin
  }
  return `${origin}/ipfs/${cid}`
}

module.exports = getGatewayUrl
