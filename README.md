# ipfs-deploy

[![standard-readme
compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)
[![](https://img.shields.io/badge/project-IPFS-blue.svg?style=flat-square)](http://ipfs.io/)
[![](https://img.shields.io/badge/freenode-%23ipfs-blue.svg?style=flat-square)](http://webchat.freenode.net/?channels=%23ipfs)
[![](https://img.shields.io/github/workflow/status/ipfs-shipyard/ipfs-deploy/Node.js%20CI/master?style=flat-square)](https://github.com/ipfs-shipyard/ipfs-deploy/actions/workflows/ci.yaml)

> Upload static website to IPFS pinning services and optionally update DNS.

<p align="center">
  <img src="https://user-images.githubusercontent.com/5447088/62481739-220bcc80-b7ab-11e9-8a9e-25f23ed92768.gif">
</p>

The goal of `ipfs-deploy` is to make it as easy as possible to **deploy a static
website to IPFS.**

- [Install](#install)
- [Usage](#usage)
- [API](#api)
- [Contributing](#contributing)
- [Users](#users)
- [License](#license)

## Install

```bash
npm install -g ipfs-deploy
```

You can call it either as `ipd` or as `ipfs-deploy`:

```bash
ipd public/
ipfs-deploy public/
```

You can run it directly with [npx](https://www.npmjs.com/package/npx 'npx') so
you don't need to install it:

```bash
npx ipfs-deploy _site
```

It will deploy to a public pinning service and give you a link to
`ipfs.io/ipfs/QmHash` so you can check it out.

## Usage

Please check [md/usage.md](md/usage.md) for further information!

## API

> There is an API so, however it is somewhat unstable and subject to change.

Please check [md/api.md](md/api.md) for further information!

## Contributing

Please check [md/contributing.md](md/contributing.md) for further information!

## Users

- [agentofuser.com](https://agentofuser.com)
- [jaack.me](https://ipfs.jaack.me)
- [kevincox.ca](https://kevincox.ca)
- [xkcd.hacdias.com](https://xkcd.hacdias.com)
- _Your website here_

If you use this package to deploy your website, please send a pull request so I
can add it to the [Users](#users) section in the README. (I reserve the right to
exercise discretion.)

## License

[BlueOak-1.0.0 OR BSD-2-Clause-Patent OR MIT © Agent of User](./LICENSE.md)

(The first two are the most permissive possible ever, more than MIT, which
doesn't have a patent waiver. Use whichever satisfies your lawyer better.)
