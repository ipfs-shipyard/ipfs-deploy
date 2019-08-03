const ora = require('ora')
const doOpen = require('open')

const { linkUrl } = require('./pure-fns')

module.exports = async url => {
  const spinner = ora()
  spinner.start('🏄  Opening web browser…')
  const childProcess = await doOpen(url)
  spinner.succeed('🏄  Opened URL on web browser (call with -O to disable):')
  spinner.info(linkUrl(url))
  return childProcess
}
