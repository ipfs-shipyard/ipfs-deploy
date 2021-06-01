const test = require('ava')
const proxyquire = require('proxyquire').noCallThru()
const { hasRightFormat } = require('./helpers')

const dnsimple = proxyquire('../../src/dnslink/dnsimple', {
  'dnslink-dnsimple': (_token, { link }) => {
    return { record: { content: `dnslink=${link}` } }
  }
})

test('dnsimple has right format', t => {
  t.is(hasRightFormat(dnsimple), true)
})

test('validate throws on wrong options', t => {
  t.throws(() => {
    dnsimple.validate({})
  })
})

test('validate succeeds on correct options', t => {
  t.notThrows(() => {
    dnsimple.validate({
      token: 'XXXXXXXXXXXXXXX',
      zone: 'example.com',
      record: '_dnslink'
    })
  })
})

test('link returns correct output', async t => {
  const res = await dnsimple.link('example.com', 'QmHash', {
    token: 'XXXXXXXXXXXXXXX',
    zone: 'example.com',
    record: '_dnslink.example.com'
  })

  t.is(res.record, '_dnslink.example.com')
  t.is(res.value, 'dnslink=/ipfs/QmHash')
})
