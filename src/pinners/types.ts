export interface PinDirOptions {
  tag?: string
  hidden?: boolean
}

export interface PinningService {
  pinDir: (dir: string, options: PinDirOptions|undefined) => Promise<string>
  pinCid: (cid: string, tag: string|undefined) => void
  gatewayUrl: (cid: string) => string
  displayName: string
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
