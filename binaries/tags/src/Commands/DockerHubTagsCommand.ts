import { Arguments, CommandModule } from 'yargs'

import { Builder } from './Builder'
import { DockerHubTags, DockerHubTagType } from '../DockerHubTags'

export interface DockerHubOptions extends Arguments {
  limit?: string
  repository: string
  tag?: string
  type: DockerHubTagType
}

export class DockerHubTagsCommand implements CommandModule<{}, DockerHubOptions> {
  command = '$0 <repository> [tag] [limit]'

  builder: Builder = {
    type: {
      choices: Object.keys(DockerHubTagType),
      default: DockerHubTagType.semver,
      type: 'string',
    },
  }

  handler = async (args: DockerHubOptions) => {
    const search = new DockerHubTags(args.repository, args.type)
    const searcher = await search.tags()

    if (args.tag && args.limit) {
      console.log(searcher.latest(args.tag, args.limit))
    } else if (args.tag) {
      console.log(searcher.latest(args.tag))
    } else {
      console.log(searcher.enumerate().map(tag => tag.value))
    }
  }
}

export const TagsCommand = new DockerHubTagsCommand()
