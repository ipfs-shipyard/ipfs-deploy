/* eslint max-nested-callbacks: ["error", 8] */
/* eslint-env mocha */
'use strict'

const { expect } = require('aegir/utils/chai')
const proxyquire = require('proxyquire').noCallThru()

it('guessPath throws when cannot find any guessable path', () => {
  const { guessPath } = proxyquire('../src/utils', {
    fs: {
      existsSync: () => false
    }
  })

  expect(guessPath).to.throw()
})

it('guessPath throws if more than one guessable path is available', () => {
  const { guessPath } = proxyquire('../src/utils', {
    fs: {
      /**
       * @param {string} path
       * @returns {boolean}
       */
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

  expect(guessPath).to.throw()
})

it('guessPath returns guessable path', () => {
  const { guessPath } = proxyquire('../src/utils', {
    fs: {
      /**
       * @param {string} path
       * @returns {boolean}
       */
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

  expect(guessPath()).to.equal('_site')
})
