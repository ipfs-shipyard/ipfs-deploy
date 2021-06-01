const Cloudflare = require('./cloudflare')
const DNSimple = require('./dnsimple')
const DreamHost = require('./dreamhost')

const dnsLinkers = [Cloudflare, DNSimple, DreamHost]

const dnsLinkersMap = dnsLinkers.reduce((map, dnsLinker) => {
  map.set(dnsLinker.slug, dnsLinker)
  return map
}, new Map())

module.exports = {
  dnsLinkers,
  dnsLinkersMap
}
