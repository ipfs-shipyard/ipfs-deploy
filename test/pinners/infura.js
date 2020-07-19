const test = require('ava')
const { hasRightFormat } = require('./helpers')
const proxyquire = require('proxyquire').noCallThru()

const IpfsHttpClientMock = () => ({
  addAll: () => [
    { cid: 'thing' },
    { cid: 'oneMore' },
    { cid: 'QmHash' }
  ],
  pin: {
    add: () => {}
  }
})

IpfsHttpClientMock.globSource = () => {}

const infura = proxyquire('../../src/pinners/infura', {
  'ipfs-http-client': IpfsHttpClientMock
})

test('infura has right format', t => {
  t.is(hasRightFormat(infura), true)
})

test('infura builder does not throw', async t => {
  await t.notThrowsAsync(() => infura.builder())
})

test('infura pinDir gets correct hash', async t => {
  const api = await infura.builder()
  t.is(await infura.pinDir(api, 'dir'), 'QmHash')
})

test('infura pinHash succeeds', async t => {
  const api = await infura.builder()
  await t.notThrowsAsync(() => infura.pinHash(api))
})
