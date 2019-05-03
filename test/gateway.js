const test = require('ava')
const httpGatewayUrl = require('../src/gateway')

test('get http gateway url for a cid', t => {
  const expected = 'https://ipfs.io/ipfs/fakecid'
  const actual = httpGatewayUrl('fakecid')
  t.is(actual, expected)
})

test('get http gateway url for a cid on infura', t => {
  const expected = 'https://ipfs.infura.io/ipfs/fakecid'
  const actual = httpGatewayUrl('fakecid', 'infura')
  t.is(actual, expected)
})

test('get http gateway url for a cid on pinata', t => {
  const expected = 'https://gateway.pinata.cloud/ipfs/fakecid'
  const actual = httpGatewayUrl('fakecid', 'pinata')
  t.is(actual, expected)
})

test('throw if no cid', t => {
  t.throws(() => {
    httpGatewayUrl()
  })
})
