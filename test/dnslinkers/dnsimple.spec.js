/* eslint max-nested-callbacks: ["error", 8] */
/* eslint-env mocha */

import { expect } from 'aegir/chai'
import esmock from 'esmock'

const DNSimple = await esmock('../../src/dnslinkers/dnsimple.js', {
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
