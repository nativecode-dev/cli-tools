import { CommandModule } from 'yargs'

import { StartsWith, EndsWith } from '../Matchers'
import { ConfigFile } from '../Config/ConfigFile'
import { DockerHubClient } from '../DockerHubClient'
import { OnlyReleases } from '../Matchers/OnlyReleases'
import { DockerHubBuilder } from '../DockerHubBuilder'
import { DockerHubTagOptions } from './DockerHubTagOptions'
import { OnlySemVer } from '../Matchers/OnlySemVer'

export class DockerHubTag implements CommandModule<{}, DockerHubTagOptions> {
  aliases = ['tags', 'tag', 't']
  command = '$0 <username> <repository> [tag] [limit]'

  builder: DockerHubBuilder = {
    'filters.ends_with': {
      array: true,
      default: [],
      type: 'string',
    },
    'filters.starts_with': {
      array: true,
      default: [],
      type: 'string',
    },
    'release-only': {
      alias: 'r',
      default: false,
      type: 'boolean',
    },
    'semver-only': {
      alias: 'v',
      default: false,
      type: 'boolean',
    },
  }

  handler = async (args: DockerHubTagOptions) => {
    const config = await ConfigFile.load(ConfigFile.filename)

    if (config.auth_token === undefined) {
      console.log('You must first login before you can access Docker Hub.')
      return process.exit(0)
    }

    const client = new DockerHubClient(config.auth_token)

    if (args.releaseOnly) {
      client.filter(OnlyReleases())
    }

    if (args.semverOnly) {
      client.filter(OnlySemVer())
    }

    if (args.filters.ends_with) {
      args.filters.ends_with.forEach(value => client.filter(EndsWith(value)))
    }

    if (args.filters.starts_with) {
      args.filters.starts_with.forEach(value => client.filter(StartsWith(value)))
    }

    const tags = await client.find(args.username, args.repository)
    tags.forEach(tag => console.log(tag.name))
  }
}

export const TagsCommand = new DockerHubTag()
