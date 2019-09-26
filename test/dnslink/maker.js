const test = require('ava')
const make = require('../../src/dnslink/maker')

test('returns undefined when has wrong options', async t => {
  const dnslink = make({
    name: 'Test',
    validate: () => { throw new Error() },
    link: () => {}
  })

  t.is(await dnslink('example.com', 'QmHash', {}), undefined)
})

test('returns undefined when has link fails', async t => {
  const dnslink = make({
    name: 'Test',
    validate: () => {},
    link: () => { throw new Error() }
  })

  t.is(await dnslink('example.com', 'QmHash', {}), undefined)
})

test('returns domain on success', async t => {
  const dnslink = make({
    name: 'Test',
    validate: () => {},
    link: (domain) => ({
      record: `_dnslink.${domain}`,
      value: domain
    })
  })

  t.is(await dnslink('example.com', 'QmHash', {}), 'example.com')
})
