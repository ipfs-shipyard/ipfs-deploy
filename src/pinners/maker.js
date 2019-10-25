const ora = require('ora')
const colors = require('colors/safe')
const _ = require('lodash')
const { logError } = require('../logging')
const { linkCid } = require('../url-utils')
const white = colors.brightWhite

module.exports = ({ name, builder, pinDir, pinHash }) => async options => {
  const slug = _.toLower(name)
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
        spinner.info(linkCid(hash, slug))

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
        spinner.info(linkCid(hash, slug))

        return hash
      } catch (error) {
        spinner.fail(`💔  Pinning to ${name} didn't work.`)
        logError(error)
        return undefined
      }
    }
  }
}
