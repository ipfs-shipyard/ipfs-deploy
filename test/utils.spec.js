/* eslint max-nested-callbacks: ["error", 8] */
/* eslint-env mocha */

import { expect } from 'aegir/chai'
import esmock from 'esmock'

it('guessPath throws when cannot find any guessable path', async () => {
  const { guessPath } = await esmock('../src/utils.js', {
    fs: {
      existsSync: () => false
    }
  })

  expect(guessPath).to.throw()
})

it('guessPath throws if more than one guessable path is available', async () => {
  const { guessPath } = await esmock('../src/utils.js', {
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

it('guessPath returns guessable path', async () => {
  const { guessPath } = await esmock('../src/utils.js', {
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
