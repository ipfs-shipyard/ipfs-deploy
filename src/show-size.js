const util = require('util')
const trammel = util.promisify(require('trammel'))
const byteSize = require('byte-size')
const ora = require('ora')
const colors = require('colors/safe')

const { logError } = require('./logging')

module.exports = async path => {
  const spinner = ora()
  spinner.start(`📦  Calculating size of ${colors.blue(path)}…`)
  try {
    const size = await trammel(path, {
      stopOnError: true,
      type: 'raw'
    })
    const kibi = byteSize(size, { units: 'iec' })
    const readableSize = `${kibi.value} ${kibi.unit}`
    spinner.succeed(
      `🚚  Directory ${colors.blue(path)} weighs ${readableSize}.`
    )
    return readableSize
  } catch (e) {
    spinner.fail("⚖  Couldn't calculate website size.")
    logError(e)
    return undefined
  }
}
