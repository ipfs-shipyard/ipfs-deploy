export interface Logger {
  // For informational messages.
  info: (message: string) => void
  // For error messages.
  error: (message: string) => void
  // For program output.
  out: (message: string) => void
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
