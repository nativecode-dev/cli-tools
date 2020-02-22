import { DockerHubOptions } from '../DockerHubOptions'

export interface DockerHubTagOptions extends DockerHubOptions {
  endsWith: string[]
  latest: boolean
  noArch: boolean
  releaseOnly: boolean
  repository: string
  semverOnly: boolean
  startsWith: string[]
  reverse: boolean

  limit?: string
  tag?: string
}
