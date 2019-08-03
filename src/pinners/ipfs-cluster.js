const fs = require('fs')
const recursive = require('recursive-fs')
const ipfsCluster = require('ipfs-cluster-api')
const multiaddr = require('multiaddr')
const _ = require('lodash')
const fp = require('lodash/fp')

module.exports = {
  name: 'IPFS Cluster',
  builder: async ({ host, username, password }) => {
    if (fp.some(_.isEmpty)([host, username, password])) {
      throw new Error(`
IPFS_DEPLOY_IPFS_CLUSTER__HOST,
IPFS_DEPLOY_IPFS_CLUSTER__USERNAME and
IPFS_DEPLOY_IPFS_CLUSTER__PASSWORD must be set.'`)
    }

    const token = Buffer.from(`${username}:${password}`).toString('base64')
    const addr = multiaddr(host).nodeAddress()

    return ipfsCluster({
      port: addr.port,
      host: addr.address,
      protocol: host.includes('/https') ? 'https' : 'http',
      headers: {
        Authorization: `Basic ${token}`,
      },
    })
  },
  pinDir: async (cluster, dir, tag) => {
    const files = await new Promise(resolve => {
      recursive.readdirr(dir, (_err, _dirs, files) => {
        resolve(
          files.map(f => ({
            path: f,
            content: fs.createReadStream(f),
          }))
        )
      })
    })

    const response = await cluster.add(files, {
      name: tag,
      recursive: true,
    })

    return response[response.length - 1].hash
  },
  pinHash: async (cluster, hash, tag) => {
    return cluster.pin.add(hash, {
      name: tag,
    })
  },
}
