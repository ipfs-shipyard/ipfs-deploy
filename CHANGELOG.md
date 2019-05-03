# [7.3.0](https://github.com/agentofuser/ipfs-deploy/compare/v7.2.1...v7.3.0) (2019-05-03)

### Features

- notify when update is available
  ([b5afeef](https://github.com/agentofuser/ipfs-deploy/commit/b5afeef))

## [7.2.1](https://github.com/agentofuser/ipfs-deploy/compare/v7.2.0...v7.2.1) (2019-05-03)

### Bug Fixes

- fix missing pinata name when domain empty
  ([8023d82](https://github.com/agentofuser/ipfs-deploy/commit/8023d82))

# [7.2.0](https://github.com/agentofuser/ipfs-deploy/compare/v7.1.1...v7.2.0) (2019-05-02)

### Features

- show gateway url for IPFS pinning service
  ([e964d00](https://github.com/agentofuser/ipfs-deploy/commit/e964d00))

## [7.1.1](https://github.com/agentofuser/ipfs-deploy/compare/v7.1.0...v7.1.1) (2019-05-01)

### Bug Fixes

- **bin:** Handle no path arg when also can't guess
  ([525aeac](https://github.com/agentofuser/ipfs-deploy/commit/525aeac))

# [7.1.0](https://github.com/agentofuser/ipfs-deploy/compare/v7.0.3...v7.1.0) (2019-04-30)

### Features

- Prevent Infura timeouts when only pinner
  ([51ef698](https://github.com/agentofuser/ipfs-deploy/commit/51ef698))

## [7.0.3](https://github.com/agentofuser/ipfs-deploy/compare/v7.0.2...v7.0.3) (2019-04-25)

### Bug Fixes

- Publish to correct registry
  ([a6f71f1](https://github.com/agentofuser/ipfs-deploy/commit/a6f71f1))

## [7.0.2](https://github.com/agentofuser/ipfs-deploy/compare/v7.0.1...v7.0.2) (2019-04-22)

### Bug Fixes

- Promote prettier to regular dependency
  ([24f198e](https://github.com/agentofuser/ipfs-deploy/commit/24f198e))

## [7.0.1](https://github.com/agentofuser/ipfs-deploy/compare/v7.0.0...v7.0.1) (2019-04-22)

### Bug Fixes

- Fix missing dependency
  ([34d8bff](https://github.com/agentofuser/ipfs-deploy/commit/34d8bff))

# [7.0.0](https://github.com/agentofuser/ipfs-deploy/compare/v6.0.1...v7.0.0) (2019-04-22)

### Code Refactoring

- **daemon:** Remove js-ipfsd-ctl
  ([71761c3](https://github.com/agentofuser/ipfs-deploy/commit/71761c3))

### BREAKING CHANGES

- **daemon:** - js-ipfs requires manual port forwarding

## [6.0.1](https://github.com/agentofuser/ipfs-deploy/compare/v6.0.0...v6.0.1) (2019-04-15)

### Bug Fixes

- **ipfsd:** Listen to peers outside localhost
  ([618e1a2](https://github.com/agentofuser/ipfs-deploy/commit/618e1a2))

# [6.0.0](https://github.com/agentofuser/ipfs-deploy/compare/v5.0.1...v6.0.0) (2019-04-14)

### Features

- Guess SSG build path when none provided
  ([184c66f](https://github.com/agentofuser/ipfs-deploy/commit/184c66f))

### BREAKING CHANGES

- - Make [path] parameter optional for good

* Use list of destination directories of common static site generators to guess
  directory to be deployed when none provided

## [5.0.1](https://github.com/agentofuser/ipfs-deploy/compare/v5.0.0...v5.0.1) (2019-04-13)

### Bug Fixes

- **config:** Handle missing envvars informatively
  ([25aee12](https://github.com/agentofuser/ipfs-deploy/commit/25aee12))

# [5.0.0](https://github.com/agentofuser/ipfs-deploy/compare/v4.0.2...v5.0.0) (2019-04-12)

### Bug Fixes

- Guard property access
  ([77b5a05](https://github.com/agentofuser/ipfs-deploy/commit/77b5a05))

### Features

- Show size of directory to be deployed
  ([abe44f4](https://github.com/agentofuser/ipfs-deploy/commit/abe44f4))

### BREAKING CHANGES

- - Remove option to pin only locally for now Detecting an existing running
    daemon has to be improved

## [4.0.2](https://github.com/agentofuser/ipfs-deploy/compare/v4.0.1...v4.0.2) (2019-04-11)

### Bug Fixes

- **bin:** Make path mandatory
  ([4a634a5](https://github.com/agentofuser/ipfs-deploy/commit/4a634a5))
- **clipboard:** Hide clipboard msgs when disabled
  ([4e74497](https://github.com/agentofuser/ipfs-deploy/commit/4e74497))
- **daemon:** Handle ipfs daemon connection errors
  ([e56506b](https://github.com/agentofuser/ipfs-deploy/commit/e56506b))

## [4.0.1](https://github.com/agentofuser/ipfs-deploy/compare/v4.0.0...v4.0.1) (2019-04-11)

### Bug Fixes

- Handle infura pinning error
  ([d6d6559](https://github.com/agentofuser/ipfs-deploy/commit/d6d6559))

# [4.0.0](https://github.com/agentofuser/ipfs-deploy/compare/v3.1.1...v4.0.0) (2019-04-08)

### Features

- Add return values to API and CLI
  ([90a3395](https://github.com/agentofuser/ipfs-deploy/commit/90a3395))

### BREAKING CHANGES

- - Return pinned hash from deploy()
- Return pinned hash from CLI

## [3.1.1](https://github.com/agentofuser/ipfs-deploy/compare/v3.1.0...v3.1.1) (2019-04-08)

### Bug Fixes

- Pick public multiaddresses properly
  ([68d238a](https://github.com/agentofuser/ipfs-deploy/commit/68d238a))

# [3.1.0](https://github.com/agentofuser/ipfs-deploy/compare/v3.0.0...v3.1.0) (2019-04-08)

### Features

- Spawn bundled daemon when ipfs not installed
  ([2711044](https://github.com/agentofuser/ipfs-deploy/commit/2711044))

# [3.0.0](https://github.com/agentofuser/ipfs-deploy/compare/v2.0.0...v3.0.0) (2019-04-07)

### Features

- Add `ipd` as shorter binary alias
  ([089f23e](https://github.com/agentofuser/ipfs-deploy/commit/089f23e))
- Remove friction from first use
  ([000d323](https://github.com/agentofuser/ipfs-deploy/commit/000d323))

### BREAKING CHANGES

- - Make 'public' default deploy path for binary
- Open public gateway URL on browser by default, use -O to opt-out
- Don't require signing up for anything with default options
- Don't upload to pinata by default
- Don't update cloudflare DNS by default, use -d cloudflare
- Keep uploading to infura, which doesn't require signup
- Rework API options for deploy()

# [2.0.0](https://github.com/agentofuser/ipfs-deploy/compare/v1.2.0...v2.0.0) (2019-04-04)

### Features

- Parameterize binary and library
  ([53ce7a6](https://github.com/agentofuser/ipfs-deploy/commit/53ce7a6))

### BREAKING CHANGES

- - Ask for path to deploy when running binary

* Move dotenv call from library to binary
* Use IPFS_DEPLOY prefix in env variables and change their names
* Change deploy() signature to take credentials & domain as parameters

# [1.2.0](https://github.com/agentofuser/ipfs-deploy/compare/v1.1.0...v1.2.0) (2019-04-04)

### Features

- Add --help and parameterize CLI and library
  ([726fd8d](https://github.com/agentofuser/ipfs-deploy/commit/726fd8d))
- Add ipfs-deploy executable
  ([51db254](https://github.com/agentofuser/ipfs-deploy/commit/51db254))

# [1.1.0](https://github.com/agentofuser/ipfs-deploy/compare/v1.0.0...v1.1.0) (2019-04-03)

### Bug Fixes

- fix ora newlines
  ([4335458](https://github.com/agentofuser/ipfs-deploy/commit/4335458))

### Features

- deploy to infura.io besides pinata.cloud
  ([3502bc7](https://github.com/agentofuser/ipfs-deploy/commit/3502bc7))

# 1.0.0 (2019-04-03)

### Features

- **meta:** become a published package
  ([380b8ed](https://github.com/agentofuser/ipfs-deploy/commit/380b8ed))
