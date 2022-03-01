# [11.2.0](https://github.com/ipfs-shipyard/ipfs-deploy/compare/v11.1.0...v11.2.0) (2022-03-01)


### Features

* c4rex pinning service ([#229](https://github.com/ipfs-shipyard/ipfs-deploy/issues/229)) ([ff2e7f2](https://github.com/ipfs-shipyard/ipfs-deploy/commit/ff2e7f2254f03a4e286f4449eaccb95136956876))
* route53 dns service ([#230](https://github.com/ipfs-shipyard/ipfs-deploy/issues/230)) ([391e2c3](https://github.com/ipfs-shipyard/ipfs-deploy/commit/391e2c3a8a38ab198405b5b59a8ed332c8eb165f))



# [11.1.0](https://github.com/ipfs-shipyard/ipfs-deploy/compare/v11.0.1...v11.1.0) (2021-11-19)


### Bug Fixes

* allow non-directory paths ([#226](https://github.com/ipfs-shipyard/ipfs-deploy/issues/226)) ([f450621](https://github.com/ipfs-shipyard/ipfs-deploy/commit/f450621f1816f30156f450e9a5ef31fb2d30bfbb))



## [11.0.1](https://github.com/ipfs-shipyard/ipfs-deploy/compare/v11.0.0...v11.0.1) (2021-08-11)


### Bug Fixes

* resolve path before pinning ([#224](https://github.com/ipfs-shipyard/ipfs-deploy/issues/224)) ([2ac842b](https://github.com/ipfs-shipyard/ipfs-deploy/commit/2ac842bd231b58b5bc70f5141c4c8f6466df86c5))



# [11.0.0](https://github.com/ipfs-shipyard/ipfs-deploy/compare/v10.1.1...v11.0.0) (2021-07-19)


### Bug Fixes

* hostname link works ([#221](https://github.com/ipfs-shipyard/ipfs-deploy/issues/221)) ([43c328e](https://github.com/ipfs-shipyard/ipfs-deploy/commit/43c328e62ecd7f038e8e29657d9b3b33bac862d0))



## [10.1.1](https://github.com/ipfs-shipyard/ipfs-deploy/compare/v10.1.0...v10.1.1) (2021-07-01)



# [10.1.0](https://github.com/ipfs-shipyard/ipfs-deploy/compare/v10.0.1...v10.1.0) (2021-06-05)


### Bug Fixes

* output logs to stderr ([#216](https://github.com/ipfs-shipyard/ipfs-deploy/issues/216)) ([65878d0](https://github.com/ipfs-shipyard/ipfs-deploy/commit/65878d04adeaef5837407f1e9950f8ca3709369a))
* scope clipboardy and open and warn on error ([#213](https://github.com/ipfs-shipyard/ipfs-deploy/issues/213)) ([7e15e59](https://github.com/ipfs-shipyard/ipfs-deploy/commit/7e15e5995a34c76f3282d9940eec8fad551626f0))



## [10.0.1](https://github.com/ipfs-shipyard/ipfs-deploy/compare/v10.0.0...v10.0.1) (2021-06-05)


### Bug Fixes

* throw if can't determine CID ([9f97af9](https://github.com/ipfs-shipyard/ipfs-deploy/commit/9f97af9886734e2a79db74b9bd2750d7a87cf615))



# [10.0.0](https://github.com/ipfs-shipyard/ipfs-deploy/compare/v9.0.3...v10.0.0) (2021-06-05)



## [9.0.3](https://github.com/ipfs-shipyard/ipfs-deploy/compare/v9.0.2...v9.0.3) (2021-06-04)


### Bug Fixes

* max content and body length set to infinity ([ca880a2](https://github.com/ipfs-shipyard/ipfs-deploy/commit/ca880a2751e72feb7a0a0066d23c7505c1ad5e2c))



## [9.0.2](https://github.com/ipfs-shipyard/ipfs-deploy/compare/v9.0.1...v9.0.2) (2021-06-04)


### Bug Fixes

* maxContentLength Infinity must be a string ([29c231a](https://github.com/ipfs-shipyard/ipfs-deploy/commit/29c231a0e0c5eeecb1a07ce41a727c6e8d560ea7))



## [9.0.1](https://github.com/ipfs-shipyard/ipfs-deploy/compare/v9.0.0...v9.0.1) (2021-06-04)



# [9.0.0](https://github.com/ipfs-shipyard/ipfs-deploy/compare/v8.1.0...v9.0.0) (2021-06-04)


### Bug Fixes

* dir is always a directory ([c3fd85c](https://github.com/ipfs-shipyard/ipfs-deploy/commit/c3fd85c63e67953006f507ebade45dd42402ff9e))
* get cid of base directory ([18234f3](https://github.com/ipfs-shipyard/ipfs-deploy/commit/18234f364f817dfe54f73336232746d5cbbeb95a))
* ignore _site and remove ([ff946f3](https://github.com/ipfs-shipyard/ipfs-deploy/commit/ff946f3f4c47f1d619b6e814c43ad48a2206c277))
* print error stack trace if available ([9f51d07](https://github.com/ipfs-shipyard/ipfs-deploy/commit/9f51d07a05b4409b66d0b9957014b5bf92ab2dbc))
* remove IpfsNode from the list for now ([6056d0a](https://github.com/ipfs-shipyard/ipfs-deploy/commit/6056d0abfcce6b0454795354f9bee609c63a2635))


### Features

* typings ([d4236c7](https://github.com/ipfs-shipyard/ipfs-deploy/commit/d4236c70e0dc616607c5ccc73b4425c33ffe2dfe))



# [8.1.0](https://github.com/ipfs-shipyard/ipfs-deploy/compare/v8.0.1...v8.1.0) (2021-06-01)


### Bug Fixes

* pinata deploy error handling and 429 retries ([#192](https://github.com/ipfs-shipyard/ipfs-deploy/issues/192)) ([8c1c09d](https://github.com/ipfs-shipyard/ipfs-deploy/commit/8c1c09d8feacfb48457cdaa643995a19462dfbd6))
* site-domain parameter when using cloudflare ([#197](https://github.com/ipfs-shipyard/ipfs-deploy/issues/197)) ([be5031a](https://github.com/ipfs-shipyard/ipfs-deploy/commit/be5031a295c269acabd1ea48c03c2cb1bbc82cc2))


### Features

* DreamHost DNS support. ([#196](https://github.com/ipfs-shipyard/ipfs-deploy/issues/196)) ([d4f0162](https://github.com/ipfs-shipyard/ipfs-deploy/commit/d4f0162e475bbfda08f8f3c09cebd71f4525eebb))



## [8.0.1](https://github.com/ipfs-shipyard/ipfs-deploy/compare/v8.0.0...v8.0.1) (2020-07-19)



# [8.0.0](https://github.com/ipfs-shipyard/ipfs-deploy/compare/v7.14.0...v8.0.0) (2020-07-19)


### Features

* adds options to alter logging behavior ([#174](https://github.com/ipfs-shipyard/ipfs-deploy/issues/174)) ([3bd0313](https://github.com/ipfs-shipyard/ipfs-deploy/commit/3bd031318f5520f1cd8b3305ba9d2d2490e5ce73))



# [7.14.0](https://github.com/ipfs-shipyard/ipfs-deploy/compare/v7.13.0...v7.14.0) (2020-01-27)


### Bug Fixes

* adding --site-domain to --help ([#135](https://github.com/ipfs-shipyard/ipfs-deploy/issues/135)) ([00624fc](https://github.com/ipfs-shipyard/ipfs-deploy/commit/00624fcbd86666f9f9715717acdff3e4a42992d5))



# [7.13.0](https://github.com/ipfs-shipyard/ipfs-deploy/compare/v7.12.0...v7.13.0) (2019-11-11)


### Features

* add DAppNode pinner ([#113](https://github.com/ipfs-shipyard/ipfs-deploy/issues/113)) ([3bb60fb](https://github.com/ipfs-shipyard/ipfs-deploy/commit/3bb60fb98cdc25da2cff80ae999e4ddb4ba0ca1a))
* support cloudflare tokens ([#109](https://github.com/ipfs-shipyard/ipfs-deploy/issues/109)) ([17e52e8](https://github.com/ipfs-shipyard/ipfs-deploy/commit/17e52e8ea453e9bc6cf73582f3e2f4414b044ebf))



# [7.12.0](https://github.com/ipfs-shipyard/ipfs-deploy/compare/v7.11.2...v7.12.0) (2019-11-06)


### Features

* **dnslink:** add DNSimple as a supported DNS service ([#110](https://github.com/ipfs-shipyard/ipfs-deploy/issues/110)) ([7034c48](https://github.com/ipfs-shipyard/ipfs-deploy/commit/7034c4896cd95d9fcc16cab24d3dd52e3bc0a430))



## [7.11.2](https://github.com/ipfs-shipyard/ipfs-deploy/compare/v7.11.1...v7.11.2) (2019-10-25)



## [7.11.1](https://github.com/ipfs-shipyard/ipfs-deploy/compare/v7.11.0...v7.11.1) (2019-09-30)


### Features

* allow large file uploads to Fission ([#101](https://github.com/ipfs-shipyard/ipfs-deploy/issues/101)) ([4cea72e](https://github.com/ipfs-shipyard/ipfs-deploy/commit/4cea72e175f30dea6c4324980a3f27b5b7c57ddb))



# [7.11.0](https://github.com/ipfs-shipyard/ipfs-deploy/compare/v7.10.5...v7.11.0) (2019-09-29)


### Features

* added Fission support ([#100](https://github.com/ipfs-shipyard/ipfs-deploy/issues/100)) ([4411625](https://github.com/ipfs-shipyard/ipfs-deploy/commit/44116255e7a6916f221c28fc1b482ed315ffe7be))



## [7.10.5](https://github.com/ipfs-shipyard/ipfs-deploy/compare/v7.10.4...v7.10.5) (2019-09-06)


### Bug Fixes

* return URL with trailing slash ([#92](https://github.com/ipfs-shipyard/ipfs-deploy/issues/92)) ([8544f30](https://github.com/ipfs-shipyard/ipfs-deploy/commit/8544f30009626063997b40334c4d996df5300ad1)), closes [#86](https://github.com/ipfs-shipyard/ipfs-deploy/issues/86)



## [7.10.4](https://github.com/ipfs-shipyard/ipfs-deploy/compare/v7.10.3...v7.10.4) (2019-08-05)


### Bug Fixes

* long directories on cluster ([b8f3f9e](https://github.com/ipfs-shipyard/ipfs-deploy/commit/b8f3f9e2d2fbf712bad3a17a4aa5a52c290350dd))
* move path to the beginnign ([2302653](https://github.com/ipfs-shipyard/ipfs-deploy/commit/2302653243d04c3022adc3b9a4c6d977579ba8a4))
* open in right gateway ([a9db360](https://github.com/ipfs-shipyard/ipfs-deploy/commit/a9db3607cb6eee56661f353699bd8d9629c5e3cb))


### Features

* simplify entry point ([365bf0e](https://github.com/ipfs-shipyard/ipfs-deploy/commit/365bf0e78261ec649b4813efc90608e1877bc05f))



## [7.10.3](https://github.com/ipfs-shipyard/ipfs-deploy/compare/v7.10.2...v7.10.3) (2019-08-05)


### Bug Fixes

* pinata absolute/rel dir ([#82](https://github.com/ipfs-shipyard/ipfs-deploy/issues/82)) ([a2cf72c](https://github.com/ipfs-shipyard/ipfs-deploy/commit/a2cf72c4ef5fb2ab7c2d66e4de7d9213e63f63c5))



## [7.10.2](https://github.com/ipfs-shipyard/ipfs-deploy/compare/v7.10.1...v7.10.2) (2019-08-05)



## [7.10.1](https://github.com/ipfs-shipyard/ipfs-deploy/compare/v7.10.0...v7.10.1) (2019-08-05)


### Bug Fixes

* remove cluster variable from pinata err ([2a766b3](https://github.com/ipfs-shipyard/ipfs-deploy/commit/2a766b3706beb800785f49d61514265ea52a1c8a))



# [7.10.0](https://github.com/ipfs-shipyard/ipfs-deploy/compare/v7.9.0...v7.10.0) (2019-08-05)


### Features

* unique upload & cleaning ([#79](https://github.com/ipfs-shipyard/ipfs-deploy/issues/79)) ([049dc81](https://github.com/ipfs-shipyard/ipfs-deploy/commit/049dc810137803195ec74dfb44ee8fb2fa6e29b9))



# [7.9.0](https://github.com/ipfs-shipyard/ipfs-deploy/compare/v7.8.0...v7.9.0) (2019-08-04)


### Features

* add support for ipfs-cluster ([#73](https://github.com/ipfs-shipyard/ipfs-deploy/issues/73)) ([80775b3](https://github.com/ipfs-shipyard/ipfs-deploy/commit/80775b3ae9b55df7b200f54b55e3ba7090bd4f22))



# [7.8.0](https://github.com/ipfs-shipyard/ipfs-deploy/compare/v7.7.3...v7.8.0) (2019-06-25)


### Bug Fixes

* **pinning:** error out if hashes don't match ([7fd847b](https://github.com/ipfs-shipyard/ipfs-deploy/commit/7fd847bf0e5ce6472bb56c4c3081cd6dcd4ebc7b))


### Features

* **naming:** support subdomain dnslink on cloudflare ([0cd3e12](https://github.com/ipfs-shipyard/ipfs-deploy/commit/0cd3e122bc878b95bb7e4030067d9e34ea223e25)), closes [#5](https://github.com/ipfs-shipyard/ipfs-deploy/issues/5)



## [7.7.3](https://github.com/ipfs-shipyard/ipfs-deploy/compare/v7.7.2...v7.7.3) (2019-06-15)


### Bug Fixes

* **clipboard:** prevent error on codesandbox.io ([ef18271](https://github.com/ipfs-shipyard/ipfs-deploy/commit/ef18271163a9e766cc47896f890c1803dd610879))



## [7.7.2](https://github.com/ipfs-shipyard/ipfs-deploy/compare/v7.7.1...v7.7.2) (2019-06-08)


### Bug Fixes

* default to open and copy to clipboard ([73a9b9d](https://github.com/ipfs-shipyard/ipfs-deploy/commit/73a9b9d526908366468fb3ea93b26663cf063947))



## [7.7.1](https://github.com/ipfs-shipyard/ipfs-deploy/compare/v7.7.0...v7.7.1) (2019-06-08)


### Bug Fixes

* fix --no-open and --no-clipboard ([12284a6](https://github.com/ipfs-shipyard/ipfs-deploy/commit/12284a601dc36c430816fd680d6fbc613c5eda69))



# [7.7.0](https://github.com/ipfs-shipyard/ipfs-deploy/compare/v7.6.0...v7.7.0) (2019-06-07)


### Bug Fixes

* don't deploy after printing version ([4cbe850](https://github.com/ipfs-shipyard/ipfs-deploy/commit/4cbe850bf7d7ca4c457f3e95ecfc94644c69a4d2)), closes [#6](https://github.com/ipfs-shipyard/ipfs-deploy/issues/6)
* print pinned hash to stdout ([2d4e2c9](https://github.com/ipfs-shipyard/ipfs-deploy/commit/2d4e2c903b79c774439550c2ce9196181a4dcb31)), closes [#9](https://github.com/ipfs-shipyard/ipfs-deploy/issues/9)


### Features

* use HTTP to pin to Pinata ([14e7453](https://github.com/ipfs-shipyard/ipfs-deploy/commit/14e74530506ef0dc8076584730cdc3ab51dfc7f1)), closes [#11](https://github.com/ipfs-shipyard/ipfs-deploy/issues/11)



# [7.6.0](https://github.com/ipfs-shipyard/ipfs-deploy/compare/v7.5.0...v7.6.0) (2019-05-17)


### Features

* support node 12 ([cb9c43f](https://github.com/ipfs-shipyard/ipfs-deploy/commit/cb9c43fa6a6907c455215e42f6a9f028e6e2c5ae))



# [7.5.0](https://github.com/ipfs-shipyard/ipfs-deploy/compare/v7.4.0...v7.5.0) (2019-05-17)


### Bug Fixes

* return just gateway url if no cid provided ([98e55d4](https://github.com/ipfs-shipyard/ipfs-deploy/commit/98e55d475770040c3137816b1378aea76bc1c0d6))


### Features

* add example ava test ([cc1c34d](https://github.com/ipfs-shipyard/ipfs-deploy/commit/cc1c34d807a22400a1dbea6a2962f6ac13bbd98a))



# [7.4.0](https://github.com/ipfs-shipyard/ipfs-deploy/compare/v7.3.0...v7.4.0) (2019-05-16)


### Features

* support node 11 ([ae1aec7](https://github.com/ipfs-shipyard/ipfs-deploy/commit/ae1aec7ae07c3a0ca94fcfc16723f72f58673f7f))



# [7.3.0](https://github.com/ipfs-shipyard/ipfs-deploy/compare/v7.2.1...v7.3.0) (2019-05-03)


### Features

* notify when update is available ([b5afeef](https://github.com/ipfs-shipyard/ipfs-deploy/commit/b5afeeffc8b94da4679c20c9c8f99704c2809847))



## [7.2.1](https://github.com/ipfs-shipyard/ipfs-deploy/compare/v7.2.0...v7.2.1) (2019-05-03)


### Bug Fixes

* fix missing pinata name when domain empty ([8023d82](https://github.com/ipfs-shipyard/ipfs-deploy/commit/8023d82b5df68076ca79bc684f45ea64e5e67c06))



# [7.2.0](https://github.com/ipfs-shipyard/ipfs-deploy/compare/v7.1.1...v7.2.0) (2019-05-02)


### Features

* show gateway url for IPFS pinning service ([e964d00](https://github.com/ipfs-shipyard/ipfs-deploy/commit/e964d00aacd566956afeda784ec56b264bacf525))



## [7.1.1](https://github.com/ipfs-shipyard/ipfs-deploy/compare/v7.1.0...v7.1.1) (2019-05-01)


### Bug Fixes

* **bin:** Handle no path arg when also can't guess ([525aeac](https://github.com/ipfs-shipyard/ipfs-deploy/commit/525aeac3334da4d4321c2fa07a0611110585f95d))



# [7.1.0](https://github.com/ipfs-shipyard/ipfs-deploy/compare/v7.0.3...v7.1.0) (2019-04-30)


### Features

* Prevent Infura timeouts when only pinner ([51ef698](https://github.com/ipfs-shipyard/ipfs-deploy/commit/51ef6985b39da6d9127e8ba1fc8881cbb980d7dc))



## [7.0.3](https://github.com/ipfs-shipyard/ipfs-deploy/compare/v7.0.2...v7.0.3) (2019-04-25)


### Bug Fixes

* Publish to correct registry ([a6f71f1](https://github.com/ipfs-shipyard/ipfs-deploy/commit/a6f71f1251dc9e6978a233ffe8979f070679e852))



## [7.0.2](https://github.com/ipfs-shipyard/ipfs-deploy/compare/v7.0.1...v7.0.2) (2019-04-22)


### Bug Fixes

* Promote prettier to regular dependency ([24f198e](https://github.com/ipfs-shipyard/ipfs-deploy/commit/24f198effb1ce1cf21af4603976a234324870de6))



## [7.0.1](https://github.com/ipfs-shipyard/ipfs-deploy/compare/v7.0.0...v7.0.1) (2019-04-22)


### Bug Fixes

* Fix missing dependency ([34d8bff](https://github.com/ipfs-shipyard/ipfs-deploy/commit/34d8bffb1cbf08ef2b69b9509eb852a4c03fa542))



# [7.0.0](https://github.com/ipfs-shipyard/ipfs-deploy/compare/v6.0.1...v7.0.0) (2019-04-22)


### Code Refactoring

* **daemon:** Remove js-ipfsd-ctl ([71761c3](https://github.com/ipfs-shipyard/ipfs-deploy/commit/71761c370eaadb94fbaee15611464c08c8ecf817))


### BREAKING CHANGES

* **daemon:** - js-ipfs requires manual port forwarding



## [6.0.1](https://github.com/ipfs-shipyard/ipfs-deploy/compare/v6.0.0...v6.0.1) (2019-04-15)


### Bug Fixes

* **ipfsd:** Listen to peers outside localhost ([618e1a2](https://github.com/ipfs-shipyard/ipfs-deploy/commit/618e1a25a1175ad043370e4209f4e4506c273b23))



# [6.0.0](https://github.com/ipfs-shipyard/ipfs-deploy/compare/v5.0.1...v6.0.0) (2019-04-14)


### Features

* Guess SSG build path when none provided ([184c66f](https://github.com/ipfs-shipyard/ipfs-deploy/commit/184c66f312310c61bf14a589d265f03b9b405d23))


### BREAKING CHANGES

* - Make [path] parameter optional for good

- Use list of destination directories of common static site generators
  to guess directory to be deployed when none provided



## [5.0.1](https://github.com/ipfs-shipyard/ipfs-deploy/compare/v5.0.0...v5.0.1) (2019-04-13)


### Bug Fixes

* **config:** Handle missing envvars informatively ([25aee12](https://github.com/ipfs-shipyard/ipfs-deploy/commit/25aee126a9cf58d1db0132a33bb5d2b71b8a14e3))



# [5.0.0](https://github.com/ipfs-shipyard/ipfs-deploy/compare/v4.0.2...v5.0.0) (2019-04-12)


### Bug Fixes

* Guard property access ([77b5a05](https://github.com/ipfs-shipyard/ipfs-deploy/commit/77b5a058028280f24c04d553784430140baed2fa))


### Features

* Show size of directory to be deployed ([abe44f4](https://github.com/ipfs-shipyard/ipfs-deploy/commit/abe44f4b90cd812d8918fa8d01990f47acd96937))


### BREAKING CHANGES

* - Remove option to pin only locally for now
  Detecting an existing running daemon has to be improved



## [4.0.2](https://github.com/ipfs-shipyard/ipfs-deploy/compare/v4.0.1...v4.0.2) (2019-04-11)


### Bug Fixes

* **bin:** Make path mandatory ([4a634a5](https://github.com/ipfs-shipyard/ipfs-deploy/commit/4a634a57154ac583595e37e682df01e5993f0a13))
* **clipboard:** Hide clipboard msgs when disabled ([4e74497](https://github.com/ipfs-shipyard/ipfs-deploy/commit/4e74497fb6605f57976d5dbccf504d46935c0110))
* **daemon:** Handle ipfs daemon connection errors ([e56506b](https://github.com/ipfs-shipyard/ipfs-deploy/commit/e56506bbf2c2de218cc0f8d4f154394a780d3a79))



## [4.0.1](https://github.com/ipfs-shipyard/ipfs-deploy/compare/v4.0.0...v4.0.1) (2019-04-11)


### Bug Fixes

* Handle infura pinning error ([d6d6559](https://github.com/ipfs-shipyard/ipfs-deploy/commit/d6d6559f6c72f63c8197726518772ed957dc1a5e))



# [4.0.0](https://github.com/ipfs-shipyard/ipfs-deploy/compare/v3.1.1...v4.0.0) (2019-04-08)


### Features

* Add return values to API and CLI ([90a3395](https://github.com/ipfs-shipyard/ipfs-deploy/commit/90a3395987ea384c8bf9a6619726e6a853427726))


### BREAKING CHANGES

* * Return pinned hash from deploy()
* Return pinned hash from CLI



## [3.1.1](https://github.com/ipfs-shipyard/ipfs-deploy/compare/v3.1.0...v3.1.1) (2019-04-08)


### Bug Fixes

* Pick public multiaddresses properly ([68d238a](https://github.com/ipfs-shipyard/ipfs-deploy/commit/68d238a1cb8ef6d068f5a34509c127c9d2e0d5f2))



# [3.1.0](https://github.com/ipfs-shipyard/ipfs-deploy/compare/v3.0.0...v3.1.0) (2019-04-08)


### Features

* Spawn bundled daemon when ipfs not installed ([2711044](https://github.com/ipfs-shipyard/ipfs-deploy/commit/2711044025372a5220fe454ee600a756e6385d0e))



# [3.0.0](https://github.com/ipfs-shipyard/ipfs-deploy/compare/v2.0.0...v3.0.0) (2019-04-07)


### Features

* Add `ipd` as shorter binary alias ([089f23e](https://github.com/ipfs-shipyard/ipfs-deploy/commit/089f23e9d50f6a3b3e942ff1f205c5267a3eefad))
* Remove friction from first use ([000d323](https://github.com/ipfs-shipyard/ipfs-deploy/commit/000d3236db32e7f7940644fc8fc2063fc71f3e31))


### BREAKING CHANGES

* * Make 'public' default deploy path for binary
* Open public gateway URL on browser by default, use -O to opt-out
* Don't require signing up for anything with default options
 * Don't upload to pinata by default
 * Don't update cloudflare DNS by default, use -d cloudflare
 * Keep uploading to infura, which doesn't require signup
* Rework API options for deploy()



# [2.0.0](https://github.com/ipfs-shipyard/ipfs-deploy/compare/v1.2.0...v2.0.0) (2019-04-04)


### Features

* Parameterize binary and library ([53ce7a6](https://github.com/ipfs-shipyard/ipfs-deploy/commit/53ce7a64b48652f228e94fdc8c1e44e8e464e6c3))


### BREAKING CHANGES

* - Ask for path to deploy when running binary
- Move dotenv call from library to binary
- Use IPFS_DEPLOY prefix in env variables and change their names
- Change deploy() signature to take credentials & domain as parameters



# [1.2.0](https://github.com/ipfs-shipyard/ipfs-deploy/compare/v1.1.0...v1.2.0) (2019-04-04)


### Features

* Add --help and parameterize CLI and library ([726fd8d](https://github.com/ipfs-shipyard/ipfs-deploy/commit/726fd8d55f9732e02bc0c27922443660bc37aa1c))
* Add ipfs-deploy executable ([51db254](https://github.com/ipfs-shipyard/ipfs-deploy/commit/51db254fe266157d808615f9791edc837cf7bbf4))



# [1.1.0](https://github.com/ipfs-shipyard/ipfs-deploy/compare/v1.0.0...v1.1.0) (2019-04-03)


### Bug Fixes

* fix ora newlines ([4335458](https://github.com/ipfs-shipyard/ipfs-deploy/commit/433545800bc025029653f4bcdd161188fc385f66))


### Features

* deploy to infura.io besides pinata.cloud ([3502bc7](https://github.com/ipfs-shipyard/ipfs-deploy/commit/3502bc7fe67a7ff1b37f18128388e775ee975604))



# [1.0.0](https://github.com/ipfs-shipyard/ipfs-deploy/compare/380b8edc8123d391a69ceb7e107278182cb863f3...v1.0.0) (2019-04-03)


### Features

* **meta:** become a published package ([380b8ed](https://github.com/ipfs-shipyard/ipfs-deploy/commit/380b8edc8123d391a69ceb7e107278182cb863f3))



