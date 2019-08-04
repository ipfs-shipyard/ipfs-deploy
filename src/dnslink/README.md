# dnslink

To add support to a new DNS service, you must start by creating a file with the
name of the DNS service. Let's say it's called DNSFree: create a file called
`dnsfree.js` with a content similar to this one:

```javascript
module.exports = {
  name: 'DNSFree',
  validate: opts => {
    // Validate the options. If bad, throw.
  },
  link: async (domain, hash, opts) => {
    // DNSLink the domain to the hash using the
    // validated options.

    return {
      record: someValue,
      value: someOtherValue,
    }
  },
}
```

Now, you have your DNS service almost set up. Go to `src/dnslink/index.js` and
add your pinner like this to the exports:

```javascript
dnsfree: makeDnslink(require('./dnsfree')),
```

Finally, go to `bin/ipfs-deploy.js` and add `dnsfree` to the list of supported
DNS providers. Also, do not forget to update the README with the new options.
