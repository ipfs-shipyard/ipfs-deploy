'use strict'

const { dnsLinkers, dnsLinkersMap } = require('./dnslinkers')
const { pinners, pinnersMap } = require('./pinners')
const deploy = require('./deploy')

module.exports = {
  deploy,
  dnsLinkers,
  dnsLinkersMap,
  pinners,
  pinnersMap
}
