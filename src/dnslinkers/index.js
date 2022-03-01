'use strict'

const Cloudflare = require('./cloudflare')
const DNSimple = require('./dnsimple')
const DreamHost = require('./dreamhost')
const Route53 = require('./route53')

const dnsLinkers = [Cloudflare, DNSimple, DreamHost, Route53]

const dnsLinkersMap = dnsLinkers.reduce((map, dnsLinker) => {
  map.set(dnsLinker.slug, dnsLinker)
  return map
}, new Map())

module.exports = {
  dnsLinkers,
  dnsLinkersMap
}
