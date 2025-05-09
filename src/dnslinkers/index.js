import Cloudflare from './cloudflare.js'
import DNSimple from './dnsimple.js'
import DreamHost from './dreamhost.js'
import Route53 from './route53.js'

export const dnsLinkers = [Cloudflare, DNSimple, DreamHost, Route53]

export const dnsLinkersMap = dnsLinkers.reduce((map, dnsLinker) => {
  map.set(dnsLinker.slug, dnsLinker)
  return map
}, new Map())
