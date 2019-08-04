# ipfs-deploy

[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)
[![](https://img.shields.io/badge/project-IPFS-blue.svg?style=flat-square)](http://ipfs.io/)
[![](https://img.shields.io/badge/freenode-%23ipfs-blue.svg?style=flat-square)](http://webchat.freenode.net/?channels=%23ipfs)
[![Travis CI](https://flat.badgen.net/travis/ipfs-shipyard/ipfs-deploy)](https://travis-ci.com/ipfs-shipyard/ipfs-deploy)

> Upload static website to IPFS pinning services and optionally update DNS.

<p align="center">
  <img src="https://cloudflare-ipfs.com/ipns/ipfs-deploy-demo.agentofuser.com/ipfs-deploy-demo.svg">
</p>

The goal of `ipfs-deploy` is to make it as easy as possible to
**deploy a static website to IPFS.**

## Table of Contents

1. [Install](#Install)
    1. [No install](#No-install)
2. [Usage](#Usage)
3. [API](#API)
4. [Security](#Security)
5. [Background](#Background)
6. [Contributors](#Contributors)
7. [Users](#Users)
8. [License](#License)

## Install

```bash
npm install -g ipfs-deploy
```

Or

```bash
yarn global add ipfs-deploy
```

You can call it either as `ipd` or as `ipfs-deploy`:

```bash
ipd public/
ipfs-deploy public/
```

### No install:

You can run it directly with [npx](https://www.npmjs.com/package/npx 'npx')
without needing to install anything:

```bash
npx ipfs-deploy _site
```

It will deploy to a public pinning service and give you a link to
`ipfs.io/ipfs/your-hash` so you can check it out.

## Usage

You can get started just by typing out **ipd** and it will have smart defaults.

It deploys to a service that doesn't need signup and gives you a link like
`ipfs.io/ipfs/hash` that you can use to see if everything went ok.

When you don't specify a path argument to deploy, **ipfs-deploy** tries to
guess it for you based on the build directories used by the most popular static
site generators:

```javascript
// prettier-ignore
const guesses = [
  '_site',         // jekyll, hakyll, eleventy
  'site',          // forgot which
  'public',        // gatsby, hugo
  'dist',          // nuxt
  'output',        // pelican
  'out',           // hexo
  'build',         // create-react-app, metalsmith, middleman
  'website/build', // docusaurus
  'docs',          // many others
]
```

---

The `--help` option has some additional usage examples:

```
Examples:
  ipfs-deploy                               # Deploys relative path "public" to
                                            ipfs.infura.io/ipfs/hash; doesn't
                                            update DNS; copies and opens URL.
                                            These defaults are chosen so as not
                                            to require signing up for any
                                            service or setting up environment
                                            variables on default use.

  ipfs-deploy -p pinata _site               # Deploys path "_site" ONLY to
                                            pinata and doesn't update DNS

  ipfs-deploy -p infura -p pinata -d        # Deploys path "public" to pinata
  cloudflare                                and infura, and updates cloudflare
                                            DNS
```

To use Pinata and Cloudflare you need to sign up for those services. You can
read up on that over at:

https://www.cloudflare.com/distributed-web-gateway

and:

https://pinata.cloud/documentation#GettingStarted

(Infura doesn't require creating an account and is therefore the default
pinning service used.)

After setting up your Cloudflare and Pinata accounts, in your website's
repository root, create or edit the file `.env` with your credentials, zone,
and record information:

```bash
# pinata credentials
IPFS_DEPLOY_PINATA__API_KEY=
IPFS_DEPLOY_PINATA__SECRET_API_KEY=

# ipfs-cluster credentials
IPFS_DEPLOY_IPFS_CLUSTER__HOST=       # multiaddr
IPFS_DEPLOY_IPFS_CLUSTER__USERNAME=   # basic auth username
IPFS_DEPLOY_IPFS_CLUSTER__PASSWORD=   # basic auth password

# cloudflare credentials
IPFS_DEPLOY_CLOUDFLARE__API_EMAIL=
IPFS_DEPLOY_CLOUDFLARE__API_KEY=

# cloudflare dns info
IPFS_DEPLOY_CLOUDFLARE__ZONE=
IPFS_DEPLOY_CLOUDFLARE__RECORD=
```

Example with top-level domain:

```bash
# cloudflare dns info
IPFS_DEPLOY_CLOUDFLARE__ZONE=agentofuser.com
IPFS_DEPLOY_CLOUDFLARE__RECORD=_dnslink.agentofuser.com
```

Example with subdomain:

```bash
# cloudflare dns info
IPFS_DEPLOY_CLOUDFLARE__ZONE=agentofuser.com
IPFS_DEPLOY_CLOUDFLARE__RECORD=_dnslink.mysubdomain.agentofuser.com
```

Important:

- Note the 2 `_` after `PINATA` and `CLOUDFLARE`.
- Remember you have to set the CNAME to `cloudflare-ipfs.com` yourself (only
  once). ipfs-deploy then creates/updates the \_dnslink record.

**Don't** commit the `.env` file to source control unless you know what you're
doing.

```
$ echo '.env' >> .gitignore
```

Assuming your website's production build is at the `public` subdirectory
(that's what Gatsby and Hugo use; Jekyll and Hakyll use `_site`), run this at
the project's root:

```bash
ipd public
```

To see more details about command line usage, run:

```bash
ipd -h
```

You can optionally add a deploy command to your `package.json`:

```javascript
//  ⋮
  "scripts": {
//  ⋮
    "deploy": "npx ipfs-deploy public",
//  ⋮
  }
//  ⋮
```

Then to run it, execute:

```bash
npm run deploy
```

## API

This is still pretty unstable and subject to change, so I will just show how
the executable currently uses the API.

```javascript
const deploy = require('ipfs-deploy')

;(async () => {
  try {
    const deployOptions = {
      publicDirPath: argv.path,
      copyHttpGatewayUrlToClipboard:
        !(argv.clipboard === false) && !argv.C && !argv.noClipboard,
      open: !(argv.open === false) && !argv.O && !argv.noOpen,
      remotePinners: argv.pinner,
      dnsProviders: argv.dns,
      siteDomain: argv.siteDomain,
      credentials: {
        cloudflare: {
          apiKey: argv.cloudflare && argv.cloudflare.apiKey,
          apiEmail: argv.cloudflare && argv.cloudflare.apiEmail,
          zone: argv.cloudflare && argv.cloudflare.zone,
          record: argv.cloudflare && argv.cloudflare.record,
        },
        pinata: {
          apiKey: argv.pinata && argv.pinata.apiKey,
          secretApiKey: argv.pinata && argv.pinata.secretApiKey,
        },
        ipfsCluster: {
          host: argv.ipfsCluster && argv.ipfsCluster.host,
          username: argv.ipfsCluster && argv.ipfsCluster.username,
          password: argv.ipfsCluster && argv.ipfsCluster.password,
        },
      },
    }

    deploy(deployOptions)
  } catch (e) {}
})()
```

## Security

We use `dotenv` to handle credentials. Don't commit your `.env` file to source
control.

## Background

So far, `ipfs-deploy` integrates with these services:

- [Infura.io](https://infura.io): freemium pinning service. Doesn't require
  signup. (Default.)
- [Pinata.cloud](https://pinata.cloud): freemium pinning service. Gives more
  control over what's uploaded. You can delete, label, and add metadata.
- [IPFS Cluster](https://cluster.ipfs.io/): self-hosted IPFS pinning service.
- [Cloudflare DNS](https://cloudflare.com): freemium DNS API. Supports CNAME
  for naked domains and integrates with their IPFS gateway at
  [cloudflare-ipfs.com](https://cloudflare-ipfs.com).

Feel free to request or add support to other services and send a PR.

You can start using `ipfs-deploy` without signing up for anything.

Default settings deploy to [infura.io](https://infura.io), which doesn't
request an account to pin stuff. They probably do some rate-limiting, but
either way, take it easy on them. Being able to try IPFS out without friction
and without giving out personal info is a very important smooth on-ramp.

Cloudflare IPFS doesn't host the content itself (it's a cached gateway), so a
stable pinning service is needed if you don't want to rely on your computer's
IPFS daemon's availability to serve your website.

These are free services subject to their terms. Not a decentralization nirvana
by any stretch of the imagination, but a nice way to get started quickly with a
blog, static website, or frontend web app.

## Contributors

This project was initially started by [@agentofuser](https://github.com/agentofuser),
who made a lot of awesome work in here. Posteriorly, it was transfered to ipfs-shipyard.
Thanks for starting this awesome project!

Everyone is welcome to contribute and add new features! [See everyone who has contributed](https://github.com/ipfs-shipyard/ipfs-deploy/graphs/contributors)!

## Users

- [agentofuser.com](https://agentofuser.com)
- [interplanetarygatsby.com](https://interplanetarygatsby.com)
- _Your website here_

If you use this package to deploy your website, please send a pull request so I
can add it to the [Users](#users) section in the README. (I reserve the right
to exercise discretion.)

## License

[BlueOak-1.0.0 OR BSD-2-Clause-Patent OR MIT © Agent of User](./LICENSE.md)

(The first two are the most permissive possible ever, more than MIT, which
doesn't have a patent waiver. Use whichever satisfies your lawyer better.)
