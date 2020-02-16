import { DockerHubOptions } from '../DockerHubOptions'

export interface DockerHubTagOptions extends DockerHubOptions {
  endsWith: string[]
  latest: boolean
  noArch: boolean
  releaseOnly: boolean
  repository: string
  semverOnly: boolean
  startsWith: string[]
  username: string

  limit?: string
  tag?: string
}
