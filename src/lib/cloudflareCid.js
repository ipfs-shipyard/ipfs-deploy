// @ts-nocheck
'use strict'
// This is copy of dnslink-cloudflare with removed update and added getLinkedCid.
const got = require('got')

async function getZoneId (api, name) {
  let res

  for (let i = 1; (res = await api(`zones?page=${i}`)) && res.body.result_info.total_pages >= i; i++) {
    for (const zone of res.body.result) {
      if (zone.name === name) {
        return zone.id
      }
    }
  }

  throw new Error(`zone ${name} couldn't be found`)
}

async function getRecord (api, id, name) {
  let res

  for (let i = 1; (res = await api(`zones/${id}/dns_records?type=TXT&page=${i}`)) && res.body.result_info.total_pages >= i; i++) {
    for (const record of res.body.result) {
      if (record.name.includes(name) && record.content.startsWith('dnslink=')) {
        return record
      }
    }
  }

  return null
}

function getClient (apiOpts) {
  const opts = {
    prefixUrl: 'https://api.cloudflare.com/client/v4',
    responseType: 'json'
  }

  if (apiOpts.token) {
    opts.headers = {
      Authorization: `Bearer ${apiOpts.token}`
    }
  } else {
    opts.headers = {
      'X-Auth-Email': apiOpts.email,
      'X-Auth-Key': apiOpts.key
    }
  }

  return got.extend(opts)
}

async function getLinkedCid (apiOpts, { zone, web3Hostname }) {
  const api = getClient(apiOpts)
  const id = await getZoneId(api, zone)
  const zoneRecord = await getRecord(api, id, web3Hostname)
  if (zoneRecord) {
    // assuming content 'dnslink=/ipfs/QmZ4tDuvesekSs4qM5ZBKpXiZGun7S2CYtEZRB3DYXkjGx'
    return zoneRecord.content.slice(zoneRecord.content.lastIndexOf('/') + 1)
  } else {
    return null
  }
}

module.exports = getLinkedCid
