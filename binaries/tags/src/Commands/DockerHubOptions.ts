import { Arguments } from 'yargs'

import { DockerHubTagType } from '../v1/DockerHubTagType'

export interface DockerHubOptions extends Arguments {
  limit?: string
  repository: string
  tag?: string
  tagStartsWith?: string[]
  type: DockerHubTagType
}
