/* eslint max-nested-callbacks: ["error", 8] */
/* eslint-env mocha */

import { expect } from 'aegir/chai'
import esmock from 'esmock'

// @ts-ignore
const getBuiltPinata = async (Pinata) => {
  const pinata = await new Pinata({
    apiKey: 'apiKey',
    secretApiKey: 'secretApiKey'
  })

  return pinata
}

const getPinataNoThrow = () => esmock('../../src/pinners/pinata.js', {
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
  const Pinata = await getPinataNoThrow()
  return getBuiltPinata(Pinata)
}

const getBuiltPinataThrowAxios = async () => {
  const Pinata = await esmock('../../src/pinners/pinata.js', {
    axios: {
      default: {
        post: () => { throw new Error() }
      }
    }
  })

  return getBuiltPinata(Pinata)
}

it('pinata constructor throws with missing options', async () => {
  const Pinata = await getPinataNoThrow()

  expect(() => new Pinata({
    apiKey: 'somewhere'
  })).to.throw()
})

it('pinata constructor does not throw with correct options', async () => {
  const Pinata = await getPinataNoThrow()

  expect(() => new Pinata({
    apiKey: 'apiKey',
    secretApiKey: 'secretApiKey'
  })).to.not.throw()
})

// it('pinata pinDir gets correct CID', async () => {
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

it('pinata pinDir throws on file system failure', async () => {
  const { default: Pinata } = await import('../../src/pinners/pinata.js')
  const pinata = await getBuiltPinata(Pinata)
  await expect(pinata.pinDir('dir')).to.be.rejected()
})
