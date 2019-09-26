const test = require('ava')
const { hasRightFormat } = require('./helpers')
const proxyquire = require('proxyquire').noCallThru()

const ipfsCluster = proxyquire('../../src/pinners/ipfs-cluster', {
  'ipfs-cluster-api': () => ({
    add: () => [
      { hash: 'thing' },
      { hash: 'oneMore' },
      { hash: 'QmHash' }
    ],
    pin: {
      add: () => {}
    }
  }),
  'recursive-fs': {
    readdirr: (_, cb) => {
      cb(null, null, [])
    }
  }
})

test('ipfs-cluster has right format', t => {
  t.is(hasRightFormat(ipfsCluster), true)
})

test('ipfs-cluster builder throws with missing options', async t => {
  await t.throwsAsync(() => ipfsCluster.builder({
    host: 'somewhere'
  }))
})

test('ipfs-cluster builder throws with wrong options', async t => {
  await t.throwsAsync(() => ipfsCluster.builder({
    host: '/not/a/multiaddress',
    username: 'user',
    password: 'pwd'
  }))
})

test('ipfs-cluster builder succeeds with correct options', async t => {
  await t.notThrowsAsync(() => ipfsCluster.builder({
    host: '/ip4/0.0.0.0/tcp/8000/https',
    username: 'user',
    password: 'pwd'
  }))
})

test('ipfs-cluster pinDir gets correct hash', async t => {
  const api = await ipfsCluster.builder({
    host: '/ip4/0.0.0.0/tcp/8000/https',
    username: 'user',
    password: 'pwd'
  })

  t.is(await ipfsCluster.pinDir(api, 'dir'), 'QmHash')
})

test('ipfs-cluster pinHash succeeds', async t => {
  const api = await ipfsCluster.builder({
    host: '/ip4/0.0.0.0/tcp/8000/https',
    username: 'user',
    password: 'pwd'
  })

  await t.notThrowsAsync(() => ipfsCluster.pinHash(api))
})
