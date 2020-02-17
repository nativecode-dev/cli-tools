export interface RepositoryImage {
  size: number
  digest: string
  architecture: string
  os: string
  os_version: string | null
  os_features: string
  variant: string
  features: string
}
