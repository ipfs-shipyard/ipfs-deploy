# pinners

To add support to a new pinning service, you must start by creating a file with
the name of the pinning service. Let's say it's called PinFree: create a file
called `pinfree.js` with a content similar to this one:

```javascript
module.exports = {
  name: 'PinFree',
  builder: opts => {
    // Validate the options. If bad, throw.
    // Return an api or the options you want to use later.

    return api
  },
  pinDir: async (api, dir, tag) => {
    // Pin a directory asynchronously, using the api
    // returned by builder and a tag.

    return hash
  },
  pinHash: async (api, hash, tag) => {
    // Pin an hash asynchronously, using the api
    // returned by builder and a tag.
    // Just throw an error if the service doesn't
    // support this action.
  },
}
```

Now, you have your pinner service almost set up. Go to `src/pinners/index.js`
and add your pinner like this to the exports:

```javascript
pinfree: makePinner(require('./pinfree')),
```

Finally, go to `bin/ipfs-deploy.js` and add `pinfree` to the list of supported
pinners.
