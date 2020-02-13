import { Arguments } from 'yargs'

import { DockerHubTagType } from '../DockerHubTagType'

export interface DockerHubOptions extends Arguments {
  limit?: string
  repository: string
  tag?: string
  type: DockerHubTagType
}
