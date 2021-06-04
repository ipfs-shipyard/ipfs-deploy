/* eslint max-nested-callbacks: ["error", 8] */
/* eslint-env mocha */
'use strict'

const { expect } = require('aegir/utils/chai')
const proxyquire = require('proxyquire').noCallThru()

const DNSimple = proxyquire('../../src/dnslinkers/dnsimple', {
  // @ts-ignore
  'dnslink-dnsimple': (_token, { link }) => {
    return { record: { content: `dnslink=${link}` } }
  }
})

it('dnsimple throws with wrong options', () => {
  expect(() => {
    return new DNSimple({})
  }).to.throw()
})

it('dnsimple succeeds on correct options', () => {
  expect(() => {
    return new DNSimple({
      token: 'XXXXXXXXXXXXXXX',
      zone: 'example.com',
      record: '_dnslink'
    })
  }).to.not.throw()
})

it('dnsimple link returns correct output', async () => {
  const dnsimple = new DNSimple({
    token: 'XXXXXXXXXXXXXXX',
    zone: 'example.com',
    record: '_dnslink'
  })

  const res = await dnsimple.link('QmHash')

  expect(res.record).to.equal('_dnslink.example.com')
  expect(res.value).to.equal('dnslink=/ipfs/QmHash')
})
