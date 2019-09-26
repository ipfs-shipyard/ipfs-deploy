const test = require('ava')
const Readable = require('stream').Readable
const { hasRightFormat } = require('./helpers')
const proxyquire = require('proxyquire').noCallThru()

const getBuiltFission = async (fission) => {
  const auth = await fission.builder({
    username: 'username',
    password: 'password'
  })

  return { fission, auth }
}

const mockFS = {
  statSync: (path) => ({
    size: 1000,
    isDirectory: () => path === 'dir'
  }),
  readdirSync: () => ([]),
  createReadStream: () => {
    const s = new Readable()
    s.push('content')
    s.push(null)
  }
}

const mockAxios = {
  post: async (url) => {
    if (url.indexOf('dag') > 0) {
      return { data: 'QmDirHash' }
    } else {
      return { data: 'QmFileHash' }
    }
  },
  put: async () => ({})
}

const getFissionNoThrow = () => proxyquire('../../src/pinners/fission', {
  fs: mockFS,
  axios: mockAxios
})

const getBuiltFissionNoThrow = async () => {
  const fission = getFissionNoThrow()
  return getBuiltFission(fission)
}

const getBuiltFissionThrowAxios = async () => {
  const fission = proxyquire('../../src/pinners/fission', {
    fs: mockFS,
    axios: {
      post: async () => { throw new Error() },
      put: async () => { throw new Error() }
    }
  })

  return getBuiltFission(fission)
}

test('fission has right format', t => {
  const fission = getFissionNoThrow()
  t.is(hasRightFormat(fission), true)
})

test('fission builder throws with missing options', async t => {
  const fission = getFissionNoThrow()
  await t.throwsAsync(() => fission.builder({
    username: 'username'
  }))
})

test('fission builder succeeds with all options', async t => {
  const fission = getFissionNoThrow()
  await t.notThrowsAsync(() => fission.builder({
    username: 'username',
    password: 'password'
  }))
})

test('fission pinDir gets correct hash when pinning a file', async t => {
  const { fission, auth } = await getBuiltFissionNoThrow()
  t.is(await fission.pinDir(auth, 'file'), 'QmFileHash')
})

test('fission pinDir gets correct hash when pinning a dir', async t => {
  const { fission, auth } = await getBuiltFissionNoThrow()
  t.is(await fission.pinDir(auth, 'dir'), 'QmDirHash')
})

test('fission pinHash succeeds', async t => {
  const { fission, auth } = await getBuiltFissionNoThrow()
  await t.notThrowsAsync(() => fission.pinHash(auth))
})

test('fission pinDir throws on HTTP request failure', async t => {
  const { fission, auth } = await getBuiltFissionThrowAxios()
  await t.throwsAsync(() => fission.pinDir(auth))
})

test('fission pinHash throws on HTTP request failure', async t => {
  const { fission, auth } = await getBuiltFissionThrowAxios()
  await t.throwsAsync(() => fission.pinHash(auth))
})

test('fission pinDir throws on file system failure', async t => {
  const { fission, auth } = await getBuiltFission(proxyquire('../../src/pinners/fission', {
    fs: {
      statSync: () => {
        throw new Error()
      },
      readdirSync: () => {
        throw new Error()
      }
    },
    axios: mockAxios
  }))

  await t.throwsAsync(() => fission.pinDir(auth))
})
