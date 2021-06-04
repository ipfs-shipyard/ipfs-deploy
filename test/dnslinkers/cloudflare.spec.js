/* eslint max-nested-callbacks: ["error", 8] */
/* eslint-env mocha */
'use strict'

const { expect } = require('aegir/utils/chai')
const proxyquire = require('proxyquire').noCallThru()

const Cloudflare = proxyquire('../../src/dnslinkers/cloudflare', {
  'dnslink-cloudflare': () => 'value'
})

it('cloudflare throws with wrong options', () => {
  expect(() => { return new Cloudflare({}) }).to.throw()
})

it('cloudflare does not throw with email and key', () => {
  expect(() => {
    return new Cloudflare({
      apiEmail: 'me@example.com',
      apiKey: 'apikey',
      zone: 'example.com',
      record: '_dnslink'
    })
  }).to.not.throw()
})

it('cloudflare does not throw with token', () => {
  expect(() => {
    return new Cloudflare({
      apiToken: 'apiToken',
      zone: 'example.com',
      record: '_dnslink'
    })
  }).to.not.throw()
})

it('cloudflare link returns correct output', async () => {
  const cloudflare = new Cloudflare({
    apiEmail: 'me@example.com',
    apiKey: 'apikey',
    zone: 'example.com',
    record: '_dnslink'
  })

  const res = await cloudflare.link('QmHash')

  expect(res.record).to.equal('_dnslink')
  expect(res.value).to.equal('value')
})
