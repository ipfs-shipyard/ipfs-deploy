const fs = require('fs')
const recursive = require('recursive-fs')
const ora = require('ora')

const ipfsCluster = require('ipfs-cluster-api')
const multiaddr = require('multiaddr')

const { logError } = require('../logging')
const { linkCid } = require('../utils/pure-fns')

const chalk = require('chalk')
const white = chalk.whiteBright

module.exports = ({ host, username, password }) => {
  const token = Buffer.from(`${username}:${password}`).toString('base64')
  const addr = multiaddr(host).nodeAddress()

  const cluster = ipfsCluster({
    port: addr.port,
    host: addr.address,
    protocol: host.includes('/https') ? 'https' : 'http',
    headers: {
      Authorization: `Basic ${token}`,
    },
  })

  return async publicDirPath => {
    const spinner = ora()
    spinner.start(
      `📠  Uploading and pinning via https to ${white('IPFS Cluster')}…`
    )

    try {
      const files = await new Promise(resolve => {
        recursive.readdirr(publicDirPath, (_err, _dirs, files) => {
          resolve(
            files.map(f => ({
              path: f,
              content: fs.createReadStream(f),
            }))
          )
        })
      })

      const response = await cluster.add(files, {
        recursive: true,
      })

      const pinnedHash = response[response.length - 1].hash
      spinner.succeed("📌  It's pinned to IPFS Cluster now with hash:")
      spinner.info(linkCid(pinnedHash, 'ipfs'))
      return pinnedHash
    } catch (e) {
      spinner.fail("💔  Uploading to IPFS Cluster didn't work.")
      logError(e)
      return undefined
    }
  }
}
