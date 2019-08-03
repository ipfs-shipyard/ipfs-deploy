const clipboardy = require('clipboardy')
const ora = require('ora')

const { logError } = require('../logging')
const { linkUrl } = require('./pure-fns')

module.exports = url => {
  const spinner = ora()
  spinner.start('📋  Copying HTTP gateway URL to clipboard…')
  try {
    clipboardy.writeSync(url)
    spinner.succeed('📋  Copied HTTP gateway URL to clipboard:')
    spinner.info(linkUrl(url))
    return url
  } catch (e) {
    spinner.fail('⚠️  Could not copy URL to clipboard.')
    logError(e)
    return undefined
  }
}
