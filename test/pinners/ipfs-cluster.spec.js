/* eslint max-nested-callbacks: ["error", 8] */
/* eslint-env mocha */

import { expect } from 'aegir/chai'
import esmock from 'esmock'

const IpfsCluster = await esmock('../../src/pinners/ipfs-cluster', {
  axios: {
    default: {
      post: async () => ({
        data: {
          IpfsHash: 'QmHash'
        }
      })
    }
  },
  'ipfs-http-client': {
    globSource: function * () {
      yield {}
    }
  }
})

it('ipfs-cluster builder throws with missing credentials', async () => {
  expect(() => new IpfsCluster({
    host: 'somewhere'
  })).to.throw()
})

it('ipfs-cluster builder throws with missing host', async () => {
  expect(() => new IpfsCluster({
    username: 'user',
    password: 'pwd'
  })).to.throw()
})

it('ipfs-cluster builder throws with correct options', async () => {
  expect(() => new IpfsCluster({
    host: 'https://myhost.com:9094',
    username: 'user',
    password: 'pwd'
  })).to.not.throw()
})

// it('ipfs-cluster pinDir gets correct hash', async () => {
//   const pinner = await new IpfsCluster({
//     host: 'https://myhost.com:9094',
//     username: 'user',
//     password: 'pwd'
//   })

//   const cid = await pinner.pinDir('dir')
//   expect(cid).to.be.equal('QmHash')
// })

it('ipfs-cluster pinCid succeeds', async () => {
  const pinner = await new IpfsCluster({
    host: 'https://myhost.com:9094',
    username: 'user',
    password: 'pwd'
  })

  await pinner.pinCid('QmHash')
})
