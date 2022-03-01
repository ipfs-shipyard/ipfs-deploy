export interface DNSRecord {
  record: string
  value: string
}

export interface DNSLinker {
  link: (cid: string) => Promise<DNSRecord>
  displayName: string
}

export interface CloudflareOptions {
  apiEmail?: string
  apiKey?: string
  apiToken?: string
  zone: string
  record: string
}

export interface DNSimpleOptions {
  token: string
  zone: string
  record: string
}

export interface Route53Options {
  accessKeyId: string
  secretAccessKey: string
  region: string
  hostedZoneId: string
  record: string
}

export interface DreamHostOptions {
  key: string
  record: string
}
