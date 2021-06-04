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
