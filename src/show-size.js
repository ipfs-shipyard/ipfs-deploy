const util = require('util')
const trammel = util.promisify(require('trammel'))
const byteSize = require('byte-size')
const colors = require('colors/safe')

const { logger, logError } = require('./logging')

module.exports = async (path, options) => {
  const log = logger(options)
  log.start(`📦  Calculating size of ${colors.blue(path)}…`)
  try {
    const size = await trammel(path, {
      stopOnError: true,
      type: 'raw'
    })
    const kibi = byteSize(size, { units: 'iec' })
    const readableSize = `${kibi.value} ${kibi.unit}`
    log.succeed(
      `🚚  Directory ${colors.blue(path)} weighs ${readableSize}.`
    )
    return readableSize
  } catch (e) {
    log.fail("⚖  Couldn't calculate website size.")
    logError(e)
    return undefined
  }
}
