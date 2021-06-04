/* eslint max-nested-callbacks: ["error", 8] */
/* eslint-env mocha */
'use strict'

const { expect } = require('aegir/utils/chai')
const proxyquire = require('proxyquire').noCallThru()

// @ts-ignore
const getBuiltPinata = async (Pinata) => {
  const pinata = await new Pinata({
    apiKey: 'apiKey',
    secretApiKey: 'secretApiKey'
  })

  return pinata
}

const getPinataNoThrow = () => proxyquire('../../src/pinners/pinata', {
  'ipfs-http-client': {
    globSource: function * () {
      yield {}
    }
  },
  axios: {
    default: {
      post: async () => ({
        data: {
          IpfsHash: 'QmHash'
        }
      })
    }
  }
})

const getBuiltPinataNoThrow = async () => {
  const Pinata = getPinataNoThrow()
  return getBuiltPinata(Pinata)
}

const getBuiltPinataThrowAxios = async () => {
  const Pinata = proxyquire('../../src/pinners/pinata', {
    axios: {
      default: {
        post: () => { throw new Error() }
      }
    }
  })

  return getBuiltPinata(Pinata)
}

it('pinata constructor throws with missing options', () => {
  const Pinata = getPinataNoThrow()

  expect(() => new Pinata({
    apiKey: 'somewhere'
  })).to.throw()
})

it('pinata constructor does not throw with correct options', () => {
  const Pinata = getPinataNoThrow()

  expect(() => new Pinata({
    apiKey: 'apiKey',
    secretApiKey: 'secretApiKey'
  })).to.not.throw()
})

// it('Pinata pinDir gets correct CID', async () => {
//   const pinata = await getBuiltPinataNoThrow()
//   const cid = await pinata.pinDir('dir')
//   await expect(cid).to.be.equal('QmHash')
// })

it('pinata pinCid succeeds', async () => {
  const pinata = await getBuiltPinataNoThrow()
  await pinata.pinCid('QmHash')
})

it('pinata pinCid throws on HTTP request failure', async () => {
  const pinata = await getBuiltPinataThrowAxios()
  await expect(pinata.pinCid('QmHash')).to.be.rejected()
})

// test('pinata pinDir throws on file system failure', async t => {
//   const { pinata, api } = await getBuiltPinata(proxyquire('../../src/pinners/pinata', {
//     axios: {
//       post: async () => {}
//     }
//   }))

//   await t.throwsAsync(() => pinata.pinDir(api))
// })
