const ora = require('ora')
const chalk = require('chalk')
const { logError } = require('../logging')
const { linkCid } = require('../url-utils')
const white = chalk.whiteBright

module.exports = ({ name, builder, pinDir, pinHash }) => async options => {
  name = white(name)
  let api

  try {
    api = await builder(options)
  } catch (e) {
    logError(e)
    return
  }

  return {
    pinDir: async (dir, tag) => {
      const spinner = ora()
      spinner.start(`📠  Uploading and pinning to ${name}…`)

      try {
        const hash = await pinDir(api, dir, tag)

        spinner.succeed(`📌  Added and pinned to ${name} with hash:`)
        spinner.info(linkCid(hash, 'infura'))

        return hash
      } catch (error) {
        spinner.fail(`💔  Uploading to ${name} didn't work.`)
        logError(error)
        return undefined
      }
    },
    pinHash: async (hash, tag) => {
      const spinner = ora()
      spinner.start(`📠  Pinning hash to ${name}…`)

      try {
        await pinHash(api, hash, tag)

        spinner.succeed(`📌  Hash pinned to ${name}:`)
        spinner.info(linkCid(hash, 'infura'))

        return hash
      } catch (error) {
        spinner.fail(`💔  Pinning to ${name} didn't work.`)
        logError(error)
        return undefined
      }
    }
  }
}
