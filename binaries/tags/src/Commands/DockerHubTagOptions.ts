import { DockerHubOptions } from '../DockerHubOptions'

export interface DockerHubTagOptions extends DockerHubOptions {
  filters: {
    ends_with: string[]
    starts_with: string[]
  }

  releaseOnly: boolean
  repository: string
  semverOnly: boolean
  username: string

  limit?: string
  tag?: string
}
