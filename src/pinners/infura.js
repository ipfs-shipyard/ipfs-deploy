const IpfsHttpClient = require('ipfs-http-client')
const { globSource } = IpfsHttpClient
const all = require('it-all')

module.exports = {
  name: 'Infura',
  builder: async () => {
    return IpfsHttpClient({
      host: 'ipfs.infura.io',
      port: '5001',
      protocol: 'https'
    })
  },
  pinDir: async (api, dir) => {
    const response = await all(api.addAll(globSource(dir, { recursive: true })))
    return response.pop().cid.toString()
  },
  pinHash: async (api, hash) => {
    return api.pin.add(hash)
  }
}
