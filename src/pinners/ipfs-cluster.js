const fs = require('fs')
const path = require('path')
const recursive = require('recursive-fs')
const ipfsCluster = require('ipfs-cluster-api')
const multiaddr = require('multiaddr')
const _ = require('lodash')
const fp = require('lodash/fp')

module.exports = {
  name: 'IPFS Cluster',
  builder: async ({ host, username, password }) => {
    if (fp.some(_.isEmpty)([host, username, password])) {
      throw new Error(`Missing the following environment variables:

IPFS_DEPLOY_IPFS_CLUSTER__HOST
IPFS_DEPLOY_IPFS_CLUSTER__USERNAME
IPFS_DEPLOY_IPFS_CLUSTER__PASSWORD`)
    }

    const token = Buffer.from(`${username}:${password}`).toString('base64')
    const addr = multiaddr(host).nodeAddress()

    return ipfsCluster({
      port: addr.port,
      host: addr.address,
      protocol: host.includes('/https') ? 'https' : 'http',
      headers: {
        Authorization: `Basic ${token}`
      }
    })
  },
  pinDir: async (cluster, dir, tag) => {
    dir = path.normalize(dir)
    const toStrip = path.dirname(dir).length
    const files = await new Promise(resolve => {
      recursive.readdirr(dir, (_err, _dirs, files) => {
        resolve(
          files.map(file => ({
            path: file.slice(toStrip),
            content: fs.createReadStream(file)
          }))
        )
      })
    })

    const response = await cluster.add(files, {
      name: tag,
      recursive: true
    })

    return response[response.length - 1].hash
  },
  pinHash: async (cluster, hash, tag) => {
    return cluster.pin.add(hash, {
      name: tag
    })
  }
}
