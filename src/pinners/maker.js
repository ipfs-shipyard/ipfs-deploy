const colors = require('colors/safe')
const _ = require('lodash')
const { logger, logError } = require('../logging')
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
      const log = logger(options)
      log.start(`📠  Uploading and pinning to ${name}…`)

      try {
        const hash = await pinDir(api, dir, tag)

        log.succeed(`📌  Added and pinned to ${name} with hash:`)
        log.info(linkCid(hash, slug))

        return hash
      } catch (error) {
        log.fail(`💔  Uploading to ${name} didn't work.`)
        logError(error)
        return undefined
      }
    },
    pinHash: async (hash, tag) => {
      const log = logger(options)
      log.start(`📠  Pinning hash to ${name}…`)

      try {
        await pinHash(api, hash, tag)

        log.succeed(`📌  Hash pinned to ${name}:`)
        log.info(linkCid(hash, slug))

        return hash
      } catch (error) {
        log.fail(`💔  Pinning to ${name} didn't work.`)
        logError(error)
        return undefined
      }
    }
  }
}
