# @agentofuser/ipfs-deploy

[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)

> Pin directory locally, send hash to pinning service, and update dnslink.

## 🚨 WARNING: This is alpha software and very much in "quick hack that works for me" status. Use with caution.

The goal of @agentofuser/ipfs-deploy is to make it as easy as possible to
deploy a static website to IPFS.

## Table of Contents

- [Security](#security)
- [Background](#background)
- [Install](#install)
- [Usage](#usage)
- [API](#api)
- [Contributing](#contributing)
- [License](#license)

## Security

We use `dotenv` to handle credentials. Don't commit your `.env` file to source
control.

## Background

So far, ipfs-deploy relies on [Pinata.cloud](https://pinata.cloud) as the
pinning service and [Cloudflare](https://cloudflare.com) as the DNS provider
and IPFS gateway. Hopefully those will be configurable in the future.

Cloudflare doesn't host the content itself, so Pinata is needed if you don't
want to rely on your computer's IPFS daemon's availability to serve your
website.

These are free services subject to their terms. Not a decentralization nirvana
by any stretch of the imagination, but a nice way to get started quickly with a
blog, static website, or frontend web app.

If you use this package to deploy your website, send a pull request and I'll
add it to the README.

## Install

```
npm install --save-dev @agentofuser/ipfs-deploy
```

## Usage

I won't go over how to set up Pinata and Cloudflare right now, but you can read
up on that over at:

https://www.cloudflare.com/distributed-web-gateway/

and:

https://pinata.cloud/documentation#GettingStarted

Then copy over `.env.sample` to `.env` and fill out your credentials:

```
PINATA_API_KEY=
PINATA_SECRET_API_KEY=
SITE_DOMAIN=
CF_API_KEY=
CF_API_EMAIL=
```

(**Don't** commit it!)

```
$ echo '.env' >> .gitignore
```

Put this somewhere in a `deploy.js` file:

```javascript
const ipfsDeploy = require(@agentofuser/ipfs-deploy)
ipfsDeploy()
```

Add a deploy command to your `package.json`:

```javascript
//  ⋮
  "scripts": {
//  ⋮
    "deploy": "node ./ipfs-deploy.js",
//  ⋮
  }
//  ⋮
```

And when you have built your website into `./public/`, run:

```
$ npm run deploy
```

## Contributing

PRs accepted.

Small note: If editing the Readme, please conform to the
[standard-readme](https://github.com/RichardLitt/standard-readme)
specification.

## License

[BlueOak-1.0.0 OR BSD-2-Clause-Patent © Agent of User](./LICENSE.md)

(These are the most permissive possible ever.)
