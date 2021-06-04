# Usage

- [Pinning Services](#pinning-services)
  - [Infura](#infura)
  - [Pinata](#pinata)
  - [Fission](#fission)
  - [IPFS Cluster](#ipfs-cluster)
  - [DAppNode](#dappnode)
- [DNS Providers](#dns-providers)
  - [Cloudflare](#cloudflare)
  - [DNSimple](#dnsimple)
  - [DreamHost](#dreamhost)

You can get started just by typing out `ipd` and it will have smart defaults.
By default, it deploys to Infura, which doesn't need signup and you'll get a
link like `ipfs.io/ipfs/QmHash` that you can use to see if everything went ok.

When you don't specify a path argument to deploy, `ipfs-deploy` tries to
guess it for you based on the build directories used by the most popular static
site generators by the following order:

| Path            | Static generators                       |
| --------        | ---------------------------------       |
| `_site`         | jekyll, hakyll, eleventy                |
| `site`          | some others                             |
| `public`        | gatsby, hugo, hexo                      |
| `dist`          | nuxt                                    |
| `output`        | pelican                                 |
| `build`         | create-react-app, metalsmith, middleman |
| `website/build` | docusaurus                              |
| `docs`          | many others                             |

Some pinning services and DNS providers require signup and additional
environment variables to be set. We support and use `.env` files. Read
the section bellow to find out about which services are supported and
how to enable them.

For further information about the CLI, please run `ipfs-deploy --help`.

## Pinning Services

Some things to keep in mind:

-  Please note the `__` (double underscore) between some words (such as
after `PINATA` and `CLOUDFLARE`).
-  **Don't** commit the `.env` file to source control unless you know what
you're doing.

These services are subject to their terms. Not a decentralization nirvana
by any stretch of the imagination, but a nice way to get started quickly with a
blog, static website, or frontend web app.

All pinning services can be used with both the `-p` (pin) and `-u` (upload) flags.
If you use only one of them, there is no difference about the end results. If you
use a mix, then `ipfs-deploy` first uploads to the services designed with `-u` and
then pins the resulting CID to the services designed with `-p`. Example:

```
npx ipfs-deploy -u pinata -p infura _site
```

Will first upload and pin to Pinata, get the resulting CID, and then pin the CID
directly on Infura without uploading all the files.

### [Infura](https://infura.io)

Infura is a freemium pinning service that doesn't require any additional setup.
It's the default one used. Please bear in mind that Infura is a free service,
so there is probably a rate-limiting.

#### How to enable

Use flag `-p infura`.

### [Pinata](https://pinata.cloud)

Pinata is another freemium pinning service. It gives you more control over
what's uploaded. You can delete, label and add custom metadata. This service
requires signup.

#### Environment variables

```bash
IPFS_DEPLOY_PINATA__API_KEY=<api key>
IPFS_DEPLOY_PINATA__SECRET_API_KEY=<secret api key>
```

#### How to enable

Use flag `-p pinata`.

### [Fission](https://fission.codes)

Fission is a backend-as-a-service that uses IPFS and supports pinning. This service requires signup.

#### Environment variables

```bash
IPFS_DEPLOY_FISSION__USERNAME=<username>
IPFS_DEPLOY_FISSION__PASSWORD=<password>
```

#### How to enable

Use flag `-p fission`.

### [IPFS Cluster](https://cluster.ipfs.io/)

You can use IPFS Cluster to pin your website. It can be either self-hosted or
just any IPFS Cluster you want.

#### Environment variables

```bash
IPFS_DEPLOY_IPFS_CLUSTER__HOST=<host url address>
IPFS_DEPLOY_IPFS_CLUSTER__USERNAME=<basic auth username>
IPFS_DEPLOY_IPFS_CLUSTER__PASSWORD=<basic auth password>
```

#### How to enable

Use flag `-p ipfs-cluster`.

### [DAppNode](https://dappnode.io)

DAppNode is not a centralized IPFS provider. It is an operation system that
allows you to effortless host a number of decentralized apps on your own hardware.
Default installation of DAppNode includes an IPFS node, available via VPN at `ipfs.dappnode`. 
If you can't reach the node make sure that you are connected to your DAppNode VPN.

#### How to enable

Use flag `-p dappnode`.

## DNS Providers

### [Cloudflare](https://cloudflare.com)

Cloudflare is a freemium DNS provider. Supports CNAME flattening for
naked domains and integrates with their IPFS gateway at
[cloudflare-ipfs.com](https://cloudflare-ipfs.com).

Bear in mind that Cloudflare IPFS doesn't host the content itself
(it's a cached gateway), so a stable pinning service is needed if you
don't want to rely on your computer's IPFS daemon's availability to
serve your website.

In order to use a Cloudflare API token you need to grant zone read and
dns edit permissions (both under the zone section). You also need to not
restrict the zone resources to a specific zone. (This is because the list
zones API call doesn't work if you only allow access to a specific zone
and that is needed to look up the id of the zone you specify.)

#### Environment variables

```bash
# credentials
IPFS_DEPLOY_CLOUDFLARE__API_EMAIL=
IPFS_DEPLOY_CLOUDFLARE__API_KEY=
# or...
IPFS_DEPLOY_CLOUDFLARE__API_TOKEN=

# dns info
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

#### How to enable

Use flag `-d cloudflare`.

### [DNSimple](https://dnsimple.com)

DNSimple is a paid-for DNS provider. They have no specific IPFS support,
but allow the setting of DNS TXT records which underlies [IPFS DNSLink](https://docs.ipfs.io/guides/concepts/dnslink/).

#### Environment variables

```bash
# credentials
IPFS_DEPLOY_DNSIMPLE__TOKEN=

# dns info
IPFS_DEPLOY_DNSIMPLE__ZONE=
IPFS_DEPLOY_DNSIMPLE__RECORD=
```

Example with top-level domain:

```bash
# dnsimple dns info
IPFS_DEPLOY_DNSIMPLE__ZONE=agentofuser.com
IPFS_DEPLOY_DNSIMPLE__RECORD=_dnslink.agentofuser.com
```

Example with subdomain:

```bash
# dnsimple dns info
IPFS_DEPLOY_DNSIMPLE__ZONE=agentofuser.com
IPFS_DEPLOY_DNSIMPLE__RECORD=_dnslink.mysubdomain.agentofuser.com
```

#### How to enable

Use flag `-d dnsimple`.

### [DreamHost](https://dreamhost.com)

DreamHost is a paid-for web host. They have no specific IPFS support, but provide DNS services with API control. [DreamHost API](https://help.dreamhost.com/hc/en-us/sections/203903178-API-Application-Programming-Interface-).

#### Environment variables

```bash
# credentials
IPFS_DEPLOY_DREAMHOST__KEY=

# dns info
IPFS_DEPLOY_DREAMHOST__RECORD=
```

Example with top-level domain:

```bash
# dreamhost dns info
IPFS_DEPLOY_DREAMHOST__RECORD=_dnslink.agentofuser.com
```

Example with subdomain:

```bash
# dreamhost dns info
IPFS_DEPLOY_DREAMHOST__RECORD=_dnslink.mysubdomain.agentofuser.com
```

#### How to enable

Use flag `-d dreamhost`.
