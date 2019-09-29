const test = require('ava')
const proxyquire = require('proxyquire').noCallThru()
const { gatewayHttpUrl } = require('../src/url-utils')

test('get http gateway url for a cid', t => {
  const expected = 'https://ipfs.io/ipfs/fakecid/'
  const actual = gatewayHttpUrl('fakecid')
  t.is(actual, expected)
})

test('get http gateway url for a cid on infura', t => {
  const expected = 'https://ipfs.infura.io/ipfs/fakecid/'
  const actual = gatewayHttpUrl('fakecid', 'infura')
  t.is(actual, expected)
})

test('get http gateway url for a cid on pinata', t => {
  const expected = 'https://gateway.pinata.cloud/ipfs/fakecid/'
  const actual = gatewayHttpUrl('fakecid', 'pinata')
  t.is(actual, expected)
})

test('get http gateway url for a cid on fission', t => {
  const expected = 'https://ipfs.runfission.com/ipfs/fakecid/'
  const actual = gatewayHttpUrl('fakecid', 'fission')
  t.is(actual, expected)
})

test('get just the http gateway url if no cid', t => {
  const expected = 'https://ipfs.io'
  const actual = gatewayHttpUrl()
  t.is(actual, expected)
})

const exampleDotCom = 'https://example.com'

test('successfully copies url to clipboard', t => {
  const { copyUrl } = proxyquire('../src/url-utils', {
    clipboardy: {
      writeSync: url => url
    }
  })

  t.is(copyUrl(exampleDotCom), exampleDotCom)
})

test('errored copy url to clipboard', t => {
  const { copyUrl } = proxyquire('../src/url-utils', {
    clipboardy: {
      writeSync: () => { throw new Error() }
    }
  })

  t.is(copyUrl(exampleDotCom), undefined)
})
