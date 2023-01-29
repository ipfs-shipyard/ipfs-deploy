# Contributing

- [Note about SDKs](#note-about-sdks)
- [Adding a Pinning Service](#adding-a-pinning-service)
- [Adding a DNS Provider](#adding-a-dns-provider)

This project was initially started by
[@agentofuser](https://github.com/agentofuser), who made a lot of awesome work
in here. Posteriorly, it was transferred to ipfs-shipyard. Thanks for starting
this awesome project!

Everyone is welcome to contribute and add new features! [See everyone who has
contributed](https://github.com/ipfs-shipyard/ipfs-deploy/graphs/contributors)!

## Note about SDKs

Most services offer Node.js SDKs in the format of a library that we can just
import. Although they are extremely handy, we recommend to try relying on pure
HTTP APIs to avoid the growth of this repository in size.

## Adding a Pinning Service

To add support for a new pinning service, you should start by creating a file
with the name of the pinning service. Let's say it's called `PinningService`:
create a file at `src/pinners/pinning-service.js` with the following contents:

```javascript
export default class PinningService {
  constructor () {
    // TODO
  }

  /**
   * @param {string} cid
   * @returns string
   */
  gatewayUrl (cid) {
    return `https://ipfs.io/ipfs/${cid}`
  }

  static get displayName () {
    return 'Pinning Service'
  }

  get displayName () {
    return PinningService.displayName
  }

  static get slug () {
    return 'pinning-service'
  }
}
```

Where `options` in the constructor are the required parameters to connect to
such service. You will also need to add the service to the list `pinners` at
`src/pinners/index.js`, as well as adding the required options in `src/cli.js`.

Also, do not forget to add documentation!

## Adding a DNS Provider

To add support for a new DNS Provider, you should start by creating a file with
the name of the DNS provider. Let's say it's called `DNS Provider`: create a
file at `src/dnslinkers/dns-provider.js` with the following contents:

```javascript
export default class DNSProvider {
  constructor () {
    // TODO
  }

  /**
   * @param {string} cid
   * @returns {Promise<DNSRecord>}
   */
  async link (cid) {
    // TODO
  }

  static get displayName () {
    return 'DNS Provider'
  }

  get displayName () {
    return DNSProvider.displayName
  }

  static get slug () {
    return 'dns-provider'
  }
}
```

Where `options` in the constructor are the required parameters to connect to
such provider. You will also need to add the provider to the list `dnsLinkers`
at `src/dnslinkers/index.js`, as well as adding the required options in
`src/cli.js`.

Also, do not forget to add documentation!
