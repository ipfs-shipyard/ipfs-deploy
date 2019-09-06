const terminalLink = require('terminal-link')
const chalk = require('chalk')
const ora = require('ora')
const clipboardy = require('clipboardy')
const doOpen = require('open')
const { logError } = require('./logging')

const GATEWAYS = {
  ipfs: 'https://ipfs.io',
  infura: 'https://ipfs.infura.io',
  pinata: 'https://gateway.pinata.cloud'
}

const gatewayHttpUrl = (cid, gatewayProvider = 'ipfs') => {
  const origin = GATEWAYS[gatewayProvider] || GATEWAYS.ipfs

  if (!cid) {
    return origin
  }

  return `${origin}/ipfs/${cid}/`
}

const linkCid = (cid, gatewayProvider) => `🔗  ${chalk.green(
  terminalLink(cid, gatewayHttpUrl(cid, gatewayProvider))
)}`

const linkUrl = (url) => `🔗  ${chalk.green(terminalLink(url, url))}`

const openUrl = async (url) => {
  const spinner = ora()
  spinner.start('🏄  Opening web browser…')
  const childProcess = await doOpen(url)
  spinner.succeed('🏄  Opened URL on web browser (call with -O to disable):')
  spinner.info(linkUrl(url))
  return childProcess
}

const copyUrl = url => {
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

module.exports = {
  linkCid,
  linkUrl,
  openUrl,
  gatewayHttpUrl,
  copyUrl
}
