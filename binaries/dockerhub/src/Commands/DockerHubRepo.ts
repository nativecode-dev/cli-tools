import { CommandModule } from 'yargs'

import { ConfigFile } from '../Config/ConfigFile'
import { DockerHubClient } from '../DockerHubClient'
import { DockerHubRepoOptions } from './DockerHubRepoOptions'

export class DockerHubRepo implements CommandModule<{}, DockerHubRepoOptions> {
  aliases = ['repositories', 'repository', 'repos', 'repo']
  command = 'repositories <username>'

  builder = {}

  handler = async (args: DockerHubRepoOptions) => {
    const config = await ConfigFile.load(ConfigFile.filename)

    if (config.auth_token === undefined) {
      console.log('You must first login before you can access Docker Hub.')
      return process.exit(0)
    }

    const client = new DockerHubClient(config.auth_token)
    const repos = await client.repositories.list(args.username || config.username)
    repos.results.sort((a, b) => (a.name > b.name ? 1 : -1)).map(repo => console.log(repo.name))
  }
}

export const ReposCommand = new DockerHubRepo()
