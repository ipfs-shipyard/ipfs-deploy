export interface Logger {
  info: (message: string) => void
  error: (message: string) => void
}

export interface DeployOptions {
  dir?: string
  cid?: string
  tag?: string

  hiddenFiles?: boolean
  copyUrl?: boolean
  openUrls?: boolean

  uploadServices: string[]
  pinningServices: string[]
  dnsProviders: string[]

  dnsProvidersCredentials: any
  pinningServicesCredentials: any

  logger: Logger
}
