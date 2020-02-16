import { Arguments } from 'yargs'
import { DockerHubFormat } from './DockerHubFormat'

export interface DockerHubOptions extends Arguments {
  format: DockerHubFormat
}
