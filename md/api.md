# Library API

We've been trying to make `ipfs-deploy` more friendly as a library. However, we
have no documentation yet.

```javascript
const { deploy, dnsLinkers, dnsLinkersMap, pinners, pinnersMap} = require('ipfs-deploy')

// Get available dnsLinkers identifiers
dnsLinkersMap.keys()

// Get available pinners identifiers
pinnersMap.keys()

// Access Cloudflare dnsLinker
dnsLinkers.Cloudflare
// ...or...
dnsLinkersMap.get('cloudflare')
```

How we currently use the deploy function:

```javascript
const { deploy } = require('ipfs-deploy')

const cid = await deploy({
  dir: argv.path,
  tag: argv.tag,
  cid: argv.cid,

  copyUrl: !argv.C,
  openUrls: argv.open,

  uploadServices: arrayFromString(argv.upload),
  pinningServices: arrayFromString(argv.pinner),
  dnsProviders: arrayFromString(argv.dns),

  dnsProvidersCredentials: {
    cloudflare: {
      apiKey: argv.cloudflare && argv.cloudflare.apiKey,
      apiToken: argv.cloudflare && argv.cloudflare.apiToken,
      apiEmail: argv.cloudflare && argv.cloudflare.apiEmail,
      zone: argv.cloudflare && argv.cloudflare.zone,
      record: argv.cloudflare && argv.cloudflare.record
    },
    dnsimple: {
      token: argv.dnsimple && argv.dnsimple.token,
      zone: argv.dnsimple && argv.dnsimple.zone,
      record: argv.dnsimple && argv.dnsimple.record
    },
    dreamhost: {
      key: argv.dreamhost && argv.dreamhost.key,
      zone: argv.dreamhost && argv.dreamhost.zone,
      record: argv.dreamhost && argv.dreamhost.record
    }
  },

  pinningServicesCredentials: {
    pinata: {
      apiKey: argv.pinata && argv.pinata.apiKey,
      secretApiKey: argv.pinata && argv.pinata.secretApiKey
    },
    'ipfs-cluster': {
      host: argv.ipfsCluster && argv.ipfsCluster.host,
      username: argv.ipfsCluster && argv.ipfsCluster.username,
      password: argv.ipfsCluster && argv.ipfsCluster.password
    },
    filebase: {
      apiKey: argv.filebase && argv.filebase.apiKey,
      secretApiKey: argv.filebase && argv.filebase.secretApiKey,
      bucket: argv.filebase && argv.filebase.bucket
    }
  }
})
```
