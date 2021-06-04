const test = require('ava')
const proxyquire = require('proxyquire').noCallThru()

test('throws when cannot find any guessable path', t => {
  const { guessPath } = proxyquire('../src/utils', {
    fs: {
      existsSync: () => false
    }
  })

  try {
    guessPath()
    t.fail('should have thrown')
  } catch (e) {
    t.pass()
  }
})

test('throws if more than one guessable path is available', t => {
  const { guessPath } = proxyquire('../src/utils', {
    fs: {
      existsSync: (path) => {
        switch (path) {
          case '_site':
          case 'site':
          case 'dist':
            return false
          default:
            return true
        }
      }
    }
  })

  try {
    guessPath()
    t.fail('should have thrown')
  } catch (e) {
    t.pass()
  }
})

test('return guessable path', t => {
  const { guessPath } = proxyquire('../src/utils', {
    fs: {
      existsSync: (path) => {
        switch (path) {
          case '_site':
            return true
          default:
            return false
        }
      }
    }
  })

  t.is(guessPath(), '_site')
})

test('gatewayUrl throws if no origin provided', t => {
  const { gatewayUrl } = require('../src/utils')

  try {
    gatewayUrl('QmHash')
    t.fail('should have thrown')
  } catch (e) {
    t.pass()
  }
})

test('gatewayUrl throws if no cid provided', t => {
  const { gatewayUrl } = require('../src/utils')

  try {
    gatewayUrl(null, 'origin')
    t.fail('should have thrown')
  } catch (e) {
    t.pass()
  }
})

test('gatewayUrl returns correct URL', t => {
  const { gatewayUrl } = require('../src/utils')
  t.is(gatewayUrl('QmHash', 'https://ipfs.io'), 'https://ipfs.io/ipfs/QmHash/')
})
