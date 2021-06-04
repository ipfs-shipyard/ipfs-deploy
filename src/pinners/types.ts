export interface PinningService {
  pinDir: (dir: string, tag: string|undefined) => Promise<string>
  pinCid: (cid: string, tag: string|undefined) => void
  gatewayUrl: (cid: string) => string
  displayName: string
}

export interface FissionOptions {
  username: string
  password: string
}

export interface IPFSClusterOptions {
  host: string
  username: string
  password: string
}

export interface PinataOptions {
  apiKey: string
  secretApiKey: string
}
