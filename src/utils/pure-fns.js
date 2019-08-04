const terminalLink = require('terminal-link')
const chalk = require('chalk')

const httpGatewayUrl = require('./gateway')

function linkCid (cid, gatewayProvider) {
  return `🔗  ${chalk.green(
    terminalLink(cid, httpGatewayUrl(cid, gatewayProvider))
  )}`
}

function linkUrl (url) {
  return `🔗  ${chalk.green(terminalLink(url, url))}`
}

module.exports = { linkCid, linkUrl }
