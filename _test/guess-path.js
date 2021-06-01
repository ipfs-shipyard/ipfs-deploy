const test = require('ava')
const proxyquire = require('proxyquire').noCallThru()

test('returns undefined when cannot find any guessable path', t => {
  const guessPath = proxyquire('../src/guess-path', {
    fs: {
      existsSync: () => false
    }
  })

  t.is(guessPath(), undefined)
})

test('returns first guessable path that exists', t => {
  const guessPath = proxyquire('../src/guess-path', {
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

  t.is(guessPath(), 'public')
})

test('returns path if not empty', t => {
  const guessPath = proxyquire('../src/guess-path', {
    _: {
      isEmpty: () => false
    }
  })

  t.is(guessPath('public'), 'public')
})
