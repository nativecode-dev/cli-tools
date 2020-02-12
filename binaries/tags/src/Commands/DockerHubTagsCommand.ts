import { Arguments, CommandModule } from 'yargs'

import { Builder } from './Builder'
import { DockerHubTags } from '../DockerHubTags'

export interface DockerHubOptions extends Arguments {
  limit?: string
  repository: string
  tag?: string
}

export class DockerHubTagsCommand implements CommandModule<{}, DockerHubOptions> {
  command = '$0 <repository> [tag] [limit]'

  builder: Builder = {}

  handler = async (args: DockerHubOptions) => {
    const search = new DockerHubTags(args.repository)
    const searcher = await search.tags()

    if (args.tag && args.limit) {
      console.log(searcher.latest(args.tag, args.limit))
    } else if (args.tag) {
      console.log(searcher.latest(args.tag))
    } else {
      console.log(searcher.enumerate().map(tag => tag.version))
    }
  }
}

export const TagsCommand = new DockerHubTagsCommand()
