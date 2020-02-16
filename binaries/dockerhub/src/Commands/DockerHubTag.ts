import { CommandModule } from 'yargs'

import { ConfigFile } from '../Config/ConfigFile'
import { DockerHubClient } from '../DockerHubClient'
import { DockerHubBuilder } from '../DockerHubBuilder'
import { DockerHubTagOptions } from './DockerHubTagOptions'

import { NoArch } from '../Matchers/NoArch'
import { EndsWith } from '../Matchers/EndsWith'
import { StartsWith } from '../Matchers/StartsWith'
import { OnlySemVer } from '../Matchers/OnlySemVer'
import { OnlyReleases } from '../Matchers/OnlyReleases'
import { VersionCompare } from '../Matchers/VersionCompare'

export class DockerHubTag implements CommandModule<{}, DockerHubTagOptions> {
  aliases = ['tags', 'tag', 't']
  command = 'tags [optons] <username> <repository> [tag] [limit]'

  builder: DockerHubBuilder = {
    'ends-with': {
      alias: 'e',
      array: true,
      default: [],
      type: 'string',
    },
    latest: {
      alias: 'l',
      default: false,
      type: 'boolean',
    },
    'no-arch': {
      alias: 'n',
      default: false,
      type: 'boolean',
    },
    'release-only': {
      alias: 'r',
      default: false,
      type: 'boolean',
    },
    'starts-with': {
      alias: 's',
      array: true,
      default: [],
      type: 'string',
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

    if (args.semverOnly || args.latest || args.tag) {
      client.match(OnlySemVer())
    }

    if (args.noArch || args.latest || args.tag) {
      client.match(NoArch())
    }

    if (args.releaseOnly) {
      client.match(OnlyReleases())
    }

    if (args.endsWith) {
      args.endsWith.forEach(value => client.match(EndsWith(value)))
    }

    if (args.startsWith) {
      args.startsWith.forEach(value => client.match(StartsWith(value)))
    }

    if (args.tag) {
      client.match(VersionCompare(args.tag, '<'))
    }

    if (args.limit) {
      client.match(VersionCompare(args.limit, '>'))
    }

    if (args.latest) {
      const latest = await client.latest(args.username, args.repository)
      console.log(latest?.repository.name)
      return
    }

    const tags = await client.find(args.username, args.repository)
    tags.map(tag => console.log(tag.repository.name))
  }
}

export const TagsCommand = new DockerHubTag()
