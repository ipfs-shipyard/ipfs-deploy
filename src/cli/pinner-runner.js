const colors = require('colors/safe')
const _ = require('lodash')
const { logger, logError } = require('./logging')
const { linkCid } = require('./url-utils')
const white = colors.brightWhite

module.exports = async (provider, options) => {
  const slug = _.toLower(provider.name)
  const name = white(provider.name)
  let api

  try {
    api = await provider.builder(options)
  } catch (e) {
    logError(e)
    return
  }

  return {
    pinDir: async (dir, tag) => {
      const log = logger(options)
      log.start(`📠  Uploading and pinning to ${name}…`)

      try {
        const hash = await provider.pinDir(api, dir, tag)

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
        await provider.pinHash(api, hash, tag)

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
