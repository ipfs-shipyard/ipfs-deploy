const test = require('ava')
const proxyquire = require('proxyquire').noCallThru()
const { hasRightFormat } = require('./helpers')

const cloudflare = proxyquire('../../src/dnslink/cloudflare', {
  'dnslink-cloudflare': () => 'value'
})

test('cloudflare has right format', t => {
  t.is(hasRightFormat(cloudflare), true)
})

test('validate throws on wrong options', t => {
  t.throws(() => { cloudflare.validate({}) })
})

test('validate succeeds on correct options', t => {
  t.notThrows(() => {
    cloudflare.validate({
      apiEmail: 'me@example.com',
      apiKey: 'apikey',
      zone: 'example.com',
      record: '_dnslink'
    })
  })
})

test('link returns correct output', async t => {
  const res = await cloudflare.link('example.com', 'QmHash', {
    apiEmail: 'me@example.com',
    apiKey: 'apikey',
    zone: 'example.com',
    record: '_dnslink'
  })

  t.is(res.record, '_dnslink')
  t.is(res.value, 'value')
})
