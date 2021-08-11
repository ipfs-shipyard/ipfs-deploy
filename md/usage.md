# Usage

- [Disclaimer and Security](#disclaimer-and-security)
- [Uploading and Pining](#uploading-and-pining)
- [Pinning CID](#pinning-cid)
- [Pinning Services Configuration](#pinning-services-configuration)
  - [Infura (default)](#infura-default)
  - [DAppNode](#dappnode)
  - [IPFS Cluster](#ipfs-cluster)
  - [Pinata](#pinata)
- [DNS Providers Configuration](#dns-providers-configuration)
  - [Cloudflare](#cloudflare)
  - [DNSimple](#dnsimple)
  - [DreamHost](#dreamhost)

You can get started just by typing out `ipd` and it will have smart defaults. By
default, it deploys to Infura, which doesn't need signup and you'll get a link
like `ipfs.io/ipfs/QmHash` that you can use to see if everything went ok.

When you don't specify a path argument to deploy, IPFS Deploy tries to guess it
for you based on the build directories used by the most popular static site
generators by the following order:

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
| `out`           | unknown others                          |

If more than one path is found, an error will be thrown and you will need to
specify exactly which one you want to deploy to avoid deploying the wrong
things.

Some pinning services and DNS providers require signup and additional
environment variables to be set. We support and use `.env` files. Read the
section bellow to find out about which services are supported and how to enable
them.

For further information about the CLI, please run `ipfs-deploy --help`. The most
recent output of this command is found below:

```
ipfs-deploy [path] [options]

Upload static websites to IPFS pinning services and, optionally, update your
DNS. Prints the CID to stdout so you can easily pipe into other programs.

Positionals:
  path  The local directory or file to be deployed                      [string]

Options:
      --version       Show version number                              [boolean]
  -C, --no-clipboard  DO NOT copy the Gateway URL to the clipboard
                                                      [boolean] [default: false]
  -o, --open          Open all Gateway URLs after deploying
                                                      [boolean] [default: false]
  -t, --tag           Used as tag in some pinning services
  -u, --upload        Upload to this pinning services. If -p is set, only these
                      services are used to upload
            [choices: "dappnode", "infura", "ipfs-cluster", "pinata"]
  -p, --pinner        Pin to this services. If -u is set, these services are
                      only used to pin and not upload. Defaults to "infura" if
                      neither -u or -p are set.
            [choices: "dappnode", "infura", "ipfs-cluster", "pinata"]
  -d, --dns           DNS provider whose dnslink TXT field will be updated
                                [choices: "cloudflare", "dnsimple", "dreamhost"]
  -c, --cid           Pin this CID instead of uploading
  -q, --quiet         Only print the CID in the end   [boolean] [default: false]
  -H, --hidden        Add hidden (dot) files to IPFS  [boolean] [default: false]
  -h, --help          Show help                                        [boolean]

Examples:
  ipfs-deploy                               Uploads and pins "public" to Infura
                                            and does not update DNS
  ipfs-deploy -p pinata _site               Uploads and pins "_site" to Pinata
                                            and does not update DNS
  ipfs-deploy -p infura -p pinata -d        Uploads and pins "_site" to Pinata
  cloudflare _site                          and Infura and updates Cloudflare
                                            DNS
  ipfs-deploy -u pinata -p infura -d        Uploads "_site" to Pinata and pins
  cloudflare _site                          the returning CID to Infura and
                                            updates Cloudflare DNS
  ipfs-deploy -c QmHash -p pinata -d        Pins QmHash to Pinata and updates
  cloudflare                                Cloudflare DNS
```

## Disclaimer and Security

Please keep in mind:

- There are `__` (double underscore) between some words, such as after the
  service name (e.g. `PINATA`).
- We use `dotenv` to handle credentials. Do **NOT** commit your `.env` file to
  source control unless you know what you're doing.
- By default, we do **NOT** upload hidden files (dot files) to IPFS. If you are
  sure you want them to be added, use the flag `-H, --hidden`.
- All of the services are subject to their terms.


## Uploading and Pining

All pinning services can be used with either `-p` (pin) or `-u` (upload) flags.
If you are uploading a directory to IPFS and just using one of both flags, there
won't be a difference in behavior.

By using a mix of `-p` and `-u` flags, you are telling IPFS Deploy to only
upload to the services indicated by `-u` and then pinning the returning CID to
the services indicated by `-p`. For example:

```
npx ipfs-deploy -u pinata -p infura _site
```

Will first upload and pin to Pinata, get the resulting CID, and then pin the CID
directly on Infura without uploading all the files.

## Pinning CID

You can use IPFS Deploy to pin a CID in multiple pinning services instead of
uploading a directory. To do so, you can use the flag `--cid`. For example:

```
npx ipfs-deploy -p pinata -p infura --cid QmHash
```

Will pin `QmHash` to Pinata and Infura.

## Pinning Services Configuration

### [Infura](https://infura.io) (default)

Infura is a freemium pinning service that doesn't require any additional setup.
It's the default one used. Please bear in mind that Infura is a free service, so
there is probably a rate-limiting.

- Usage: `-p infura`

### [DAppNode](https://dappnode.io)

DAppNode is not a centralized IPFS provider. It is an operation system that
allows you to effortless host a number of decentralized apps on your own
hardware. Default installation of DAppNode includes an IPFS node, available via
VPN at `ipfs.dappnode`. If you can't reach the node make sure that you are
connected to your DAppNode VPN.

- Usage: `-p dappnode`

### [IPFS Cluster](https://cluster.ipfs.io/)

You can use IPFS Cluster to pin your website. It can be either self-hosted or
just any IPFS Cluster you want.

- Usage: `-p ipfs-cluster`
- Environment variables
  - `IPFS_DEPLOY_IPFS_CLUSTER__HOST=<host url address>`
  - `IPFS_DEPLOY_IPFS_CLUSTER__USERNAME=<basic auth username>`
  - `IPFS_DEPLOY_IPFS_CLUSTER__PASSWORD=<basic auth password>`

### [Pinata](https://pinata.cloud)

Pinata is another freemium pinning service. It gives you more control over
what's uploaded. You can delete, label and add custom metadata. This service
requires signup.

- Usage: `-p pinata`
- Environment variables
  - `IPFS_DEPLOY_PINATA__API_KEY=<api key>`
  - `IPFS_DEPLOY_PINATA__SECRET_API_KEY=<secret api key>`

## DNS Providers Configuration

### [Cloudflare](https://cloudflare.com)

Cloudflare is a freemium DNS provider. Supports CNAME flattening for naked
domains and integrates with their IPFS gateway at
[cloudflare-ipfs.com](https://cloudflare-ipfs.com).

Bear in mind that Cloudflare IPFS doesn't host the content itself (it's a cached
gateway), so a stable pinning service is needed if you don't want to rely on
your computer's IPFS daemon's availability to serve your website.

In order to use the Cloudflare API, you either use your API Key and your email
for full access. If you prefer to use the **token**, it will need to have **read**
zone access for all zones and DNS **editing** permissions for the specific zone
being updated.

- Usage: `-d cloudflare`
- Environment variables
  - Credentials
    - `IPFS_DEPLOY_CLOUDFLARE__API_EMAIL=<username>`
    - `IPFS_DEPLOY_CLOUDFLARE__API_KEY=<password>`; or just
    - `IPFS_DEPLOY_CLOUDFLARE__API_TOKEN=<scoped token>`
  - Configuration
    - `IPFS_DEPLOY_CLOUDFLARE__ZONE=<zone>`
    - `IPFS_DEPLOY_CLOUDFLARE__RECORD=<record>`

#### Examples

```bash
# Top level domain
IPFS_DEPLOY_CLOUDFLARE__ZONE=example.com
IPFS_DEPLOY_CLOUDFLARE__RECORD=_dnslink.example.com

# Subdomain
IPFS_DEPLOY_CLOUDFLARE__ZONE=example.com
IPFS_DEPLOY_CLOUDFLARE__RECORD=_dnslink.mysubdomain.example.com
```

### [DNSimple](https://dnsimple.com)

DNSimple is a paid-for DNS provider. They have no specific IPFS support, but
allow the setting of DNS TXT records which underlies [IPFS
DNSLink](https://docs.ipfs.io/guides/concepts/dnslink/).

- Usage: `-d dnsimple`
- Environment variables
  - `IPFS_DEPLOY_DNSIMPLE__TOKEN=<token>`
  - `IPFS_DEPLOY_DNSIMPLE__ZONE=<zone>`
  - `IPFS_DEPLOY_DNSIMPLE__RECORD=<record>`

#### Examples

```bash
# Top level domain
IPFS_DEPLOY_DNSIMPLE__ZONE=example.com
IPFS_DEPLOY_DNSIMPLE__RECORD=_dnslink.example.com

# Subdomain
IPFS_DEPLOY_DNSIMPLE__ZONE=example.com
IPFS_DEPLOY_DNSIMPLE__RECORD=_dnslink.mysubdomain.example.com
```

### [DreamHost](https://dreamhost.com)

DreamHost is a paid-for web host. They have no specific IPFS support, but
provide DNS services with API control. [DreamHost
API](https://help.dreamhost.com/hc/en-us/sections/203903178-API-Application-Programming-Interface-).


- Usage: `-d dreamhost`
- Environment variables
  - `IPFS_DEPLOY_DREAMHOST__KEY=<jkey>`
  - `IPFS_DEPLOY_DREAMHOST__RECORD=<record>`

#### Examples


```bash
# Top level domain
IPFS_DEPLOY_DREAMHOST__RECORD=_dnslink.example.com

# Subdomain
IPFS_DEPLOY_DREAMHOST__RECORD=_dnslink.mysubdomain.example.com
```
