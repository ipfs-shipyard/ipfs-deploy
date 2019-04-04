# @agentofuser/ipfs-deploy

[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)

> Pin directory locally, upload to pinning service, and update dnslink.

<p align="center">
  <a href="https://asciinema.org/a/238920">
    <img width="600" src="https://www.gitcdn.xyz/repo/agentofuser/ipfs-deploy/master/docs/ipfs-deploy-demo.svg">
  </a>
</p>

## 🚨 WARNING: This is alpha software and very much in "works for me" status. APIs and CLI options will change. Use with caution, but please do, give feedback, and consider contributing :)

The goal of `@agentofuser/ipfs-deploy` is to make it as easy as possible to
deploy a static website to IPFS.

## Table of Contents

- [Security](#security)
- [Background](#background)
- [Install](#install)
- [Usage](#usage)
- [API](#api)
- [Contributing](#contributing)
- [Who's Using](#users)
- [License](#license)

## Security

We use `dotenv` to handle credentials. Don't commit your `.env` file to source
control.

## Background

So far, ipfs-deploy relies on [Pinata.cloud](https://pinata.cloud) and
[Infura.io](https://infura.io) as the pinning services and
[Cloudflare](https://cloudflare.com) as the DNS provider. Hopefully those will
be configurable in the future.

Cloudflare doesn't host the content itself, so Pinata is needed if you don't
want to rely on your computer's IPFS daemon's availability to serve your
website.

These are free services subject to their terms. Not a decentralization nirvana
by any stretch of the imagination, but a nice way to get started quickly with a
blog, static website, or frontend web app.

If you use this package to deploy your website, send a pull request and I'll
add it to the README.

## Install

### As a library:

```bash
npm install --save-dev @agentofuser/ipfs-deploy
```

### As an executable:

```bash
npm install -g @agentofuser/ipfs-deploy
```

You can call it either as `ipd` or as `ipfs-deploy`:

```bash
ipd plublic/
ipfs-deploy public/
```

### No install:

You can run it directly with [npx](https://www.npmjs.com/package/npx 'npx')
without needing to install anything:

```bash
npx ipfs-deploy _site
```

Just remember to have the credentials properly set up as instructed below.

## Usage

### As an executable:

I won't go over how to set up Pinata and Cloudflare right now, but you can read
up on that over at:

https://www.cloudflare.com/distributed-web-gateway

and:

https://pinata.cloud/documentation#GettingStarted

(Infura doesn't require creating an account.)

After setting up your Cloudflare and Pinata accounts, in your website's
repository root, create or edit the file `.env` with your domain and
credentials:

```
IPFS_DEPLOY_SITE_DOMAIN=
IPFS_DEPLOY_PINATA__API_KEY=
IPFS_DEPLOY_PINATA__SECRET_API_KEY=
IPFS_DEPLOY_CLOUDFLARE__API_EMAIL=
IPFS_DEPLOY_CLOUDFLARE__API_KEY=
```

(**Don't** commit it to source control unless you know what you're doing.)

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
ipd --help
```

You can optionally add a deploy command to your `package.json`:

```javascript
//  ⋮
  "scripts": {
//  ⋮
    "deploy": "npx ipfs-daemon public",
//  ⋮
  }
//  ⋮
```

Then to run it, execute:

```bash
npm run deploy
```

### As a library:

````javascript
const deploy = require('ipfs-deploy')

;(async () => {
  try {
    deploy({
      updateDns: true,
      open: false, // opens browser after deploying
      publicDirPath: 'public',
      remote: {
        siteDomain: 'example.com',
        cloudflare: {
          apiEmail,
          apiKey,
        },
        pinata: {
          apiKey,
          secretApiKey,
        },
      },
    })
  } catch (e) {}
})()
```

## Contributing

PRs accepted.

Small note: If editing the Readme, please conform to the
[standard-readme](https://github.com/RichardLitt/standard-readme)
specification.

## Users

- [agentofuser.com](https://agentofuser.com)
- [interplanetarygatsby.com](https://interplanetarygatsby.com)

## License

[BlueOak-1.0.0 OR BSD-2-Clause-Patent OR MIT © Agent of User](./LICENSE.md)

(The first two are the most permissive possible ever, more than MIT, which
doesn't have a patent waiver. Use whichever satisfies your lawyer better.)
````
