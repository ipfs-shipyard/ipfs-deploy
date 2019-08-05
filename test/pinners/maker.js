const test = require('ava')
const make = require('../../src/pinners/maker')

test('returns undefined when has wrong options', async t => {
  const setupPinner = make({
    name: 'Test',
    builder: () => { throw new Error() },
    pinDir: () => {},
    pinHash: () => {}
  })

  t.is(await setupPinner({}), undefined)
})

test('returns pinner when has correct options', async t => {
  const setupPinner = make({
    name: 'Test',
    builder: () => {},
    pinDir: () => {},
    pinHash: () => {}
  })

  const pinner = await setupPinner({})

  t.is(typeof pinner, 'object')
  t.is(typeof pinner.pinDir, 'function')
  t.is(typeof pinner.pinHash, 'function')
})

test('returns undefined when fails to pin dir ', async t => {
  const setupPinner = make({
    name: 'Test',
    builder: () => {},
    pinDir: () => { throw new Error() },
    pinHash: () => {}
  })

  const pinner = await setupPinner({})
  t.is(await pinner.pinDir('dir', 'tag'), undefined)
})

test('returns hash when succeeds to pin dir ', async t => {
  const setupPinner = make({
    name: 'Test',
    builder: () => {},
    pinDir: () => { return 'QmHash' },
    pinHash: () => {}
  })

  const pinner = await setupPinner({})
  t.is(await pinner.pinDir('dir', 'tag'), 'QmHash')
})

test('returns undefined when fails to pin hash ', async t => {
  const setupPinner = make({
    name: 'Test',
    builder: () => {},
    pinDir: () => {},
    pinHash: () => { throw new Error() }
  })

  const pinner = await setupPinner({})
  t.is(await pinner.pinHash('dir', 'tag'), undefined)
})

test('returns hash when succeeds to pin hash ', async t => {
  const setupPinner = make({
    name: 'Test',
    builder: () => {},
    pinDir: () => {},
    pinHash: () => { return 'QmHash' }
  })

  const pinner = await setupPinner({})
  t.is(await pinner.pinHash('QmHash', 'tag'), 'QmHash')
})
