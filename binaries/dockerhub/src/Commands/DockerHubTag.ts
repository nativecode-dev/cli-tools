import { CommandModule, CommandBuilder } from 'yargs'

import { ConfigFile } from '../Config/ConfigFile'
import { DockerHubClient } from '../DockerHubClient'
import { DockerHubTagOptions } from './DockerHubTagOptions'

import { NoArch } from '../Matchers/NoArch'
import { EndsWith } from '../Matchers/EndsWith'
import { StartsWith } from '../Matchers/StartsWith'
import { OnlySemVer } from '../Matchers/OnlySemVer'
import { OnlyReleases } from '../Matchers/OnlyReleases'
import { VersionCompare } from '../Matchers/VersionCompare'

export class DockerHubTag implements CommandModule<{}, DockerHubTagOptions> {
  aliases = ['tags', 'tag', 't']
  command = 'tags <repository> [tag] [limit]'

  builder: CommandBuilder<{}, DockerHubTagOptions> = {
    'ends-with': {
      alias: 'e',
      array: true,
      default: [],
      describe: 'find tags that end with the given string',
      type: 'string',
    },
    latest: {
      alias: 'l',
      default: false,
      describe: 'find latest tag only, triggers semver',
      type: 'boolean',
    },
    limit: {
      alias: 'm',
      describe: 'upper bounds when version checking, triggers semver',
      type: 'string',
    },
    'no-arch': {
      alias: 'n',
      default: false,
      describe: 'ignore versions with arch defined',
      type: 'boolean',
    },
    'release-only': {
      alias: 'r',
      default: false,
      describe: 'find release only version, triggers semver',
      type: 'boolean',
    },
    'starts-with': {
      alias: 's',
      array: true,
      default: [],
      describe: 'find tags that start with the given string',
      type: 'string',
    },
    'semver-only': {
      alias: 'v',
      default: false,
      describe: 'finds only semver compatible tags',
      type: 'boolean',
    },
    reverse: {
      default: false,
      describe: 'verses sorting order',
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

    if (args.semverOnly || args.releaseOnly || args.tag) {
      client.match(OnlySemVer())
    }

    if (args.noArch) {
      client.match(NoArch())
    }

    if (args.releaseOnly) {
      client.match(OnlyReleases())
    }

    if (args.endsWith) {
      args.endsWith.map(value => client.match(EndsWith(value)))
    }

    if (args.startsWith) {
      args.startsWith.map(value => client.match(StartsWith(value)))
    }

    if (args.tag) {
      client.match(VersionCompare(args.tag, '>'))
    }

    if (args.limit) {
      client.match(VersionCompare(args.limit, '<'))
    }

    if (args.latest) {
      const latest = await client.latest(args.repository)

      if (latest) {
        if (latest.version) {
          return console.log(latest.version.original)
        }

        return console.log(latest.repotag.name)
      }

      console.error('Failed to find latest:', args.repository)
      return process.exit(1)
    }

    const tags = await client.find(args.repository, args.reverse)

    return tags.map(tag => {
      if (tag.version === null) {
        return console.log(tag.repotag.name)
      }

      if (tag.version.original !== tag.repotag.name) {
        return console.log(`${tag.repotag.name} (${tag.references.map(ref => ref.repotag.name).join(', ')})`)
      }

      return console.log(tag.version.original)
    })
  }
}

export const TagsCommand = new DockerHubTag()
