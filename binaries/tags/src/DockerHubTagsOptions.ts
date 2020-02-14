import { DockerHubTagType } from './DockerHubTagType'

export interface DockerHubTagsOptions {
  repository: string
  tagStartsWith: string[]
  type: DockerHubTagType
}

export const DefaultDockerHubTagsOptions: Partial<DockerHubTagsOptions> = {
  tagStartsWith: [],
  type: DockerHubTagType.semver,
}
