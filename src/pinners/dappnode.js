const ipfsClient = require('ipfs-http-client')

module.exports = {
  name: 'DAppNode',
  builder: async () => {
    return ipfsClient({
      host: 'ipfs.dappnode',
      port: '5001',
      protocol: 'http'
    })
  },
  pinDir: async (api, dir) => {
    const response = await api.addFromFs(dir, {
      recursive: true
    })

    return response[response.length - 1].hash
  },
  pinHash: async (api, hash) => {
    return api.pin.add(hash)
  }
}
