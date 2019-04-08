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
