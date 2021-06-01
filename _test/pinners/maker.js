const test = require('ava')
const make = require('../../src/pinners/maker')

test('returns undefined when has wrong options', async t => {
  const setupPinner = make({
    name: 'Test',
    builder: () => { throw new Error() },
    pinDir: () => {},
    pinCid: () => {}
  })

  t.is(await setupPinner({}), undefined)
})

test('returns pinner when has correct options', async t => {
  const setupPinner = make({
    name: 'Test',
    builder: () => {},
    pinDir: () => {},
    pinCid: () => {}
  })

  const pinner = await setupPinner({})

  t.is(typeof pinner, 'object')
  t.is(typeof pinner.pinDir, 'function')
  t.is(typeof pinner.pinCid, 'function')
})

test('returns undefined when fails to pin dir ', async t => {
  const setupPinner = make({
    name: 'Test',
    builder: () => {},
    pinDir: () => { throw new Error() },
    pinCid: () => {}
  })

  const pinner = await setupPinner({})
  t.is(await pinner.pinDir('dir', 'tag'), undefined)
})

test('returns hash when succeeds to pin dir ', async t => {
  const setupPinner = make({
    name: 'Test',
    builder: () => {},
    pinDir: () => { return 'QmHash' },
    pinCid: () => {}
  })

  const pinner = await setupPinner({})
  t.is(await pinner.pinDir('dir', 'tag'), 'QmHash')
})

test('returns undefined when fails to pin hash ', async t => {
  const setupPinner = make({
    name: 'Test',
    builder: () => {},
    pinDir: () => {},
    pinCid: () => { throw new Error() }
  })

  const pinner = await setupPinner({})
  t.is(await pinner.pinCid('dir', 'tag'), undefined)
})

test('returns hash when succeeds to pin hash ', async t => {
  const setupPinner = make({
    name: 'Test',
    builder: () => {},
    pinDir: () => {},
    pinCid: () => { return 'QmHash' }
  })

  const pinner = await setupPinner({})
  t.is(await pinner.pinCid('QmHash', 'tag'), 'QmHash')
})
