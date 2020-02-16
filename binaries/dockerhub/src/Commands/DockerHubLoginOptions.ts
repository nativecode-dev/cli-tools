import { DockerHubOptions } from '../DockerHubOptions'

export interface DockerHubLoginOptions extends DockerHubOptions {
  password?: string
  passwdStdin: string
  username: string
}
