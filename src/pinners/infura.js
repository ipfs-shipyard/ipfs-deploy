const ipfsClient = require('ipfs-http-client')
const ora = require('ora')
const chalk = require('chalk')

const { logError } = require('../logging')
const { linkCid } = require('../utils/pure-fns')

const white = chalk.whiteBright

module.exports = () => {
  const api = ipfsClient({
    host: 'ipfs.infura.io',
    port: '5001',
    protocol: 'https'
  })

  return async dir => {
    const spinner = ora()

    try {
      spinner.start(
        `📠  Uploading and pinning via https to ${white('infura.io')}…`
      )

      const response = await api.addFromFs(dir, {
        recursive: true
      })

      spinner.succeed("📌  It's pinned to Infura now with hash:")
      const pinnedHash = response[response.length - 1].hash
      spinner.info(linkCid(pinnedHash, 'infura'))
      return pinnedHash
    } catch (e) {
      spinner.fail("💔  Uploading to Infura didn't work.")
      logError(e)
      return undefined
    }
  }
}
