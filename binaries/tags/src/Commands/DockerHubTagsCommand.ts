import { CommandModule } from 'yargs'

import { Builder } from './Builder'
import { DockerHubTags } from '../DockerHubTags'
import { DockerHubTagType } from '../DockerHubTagType'
import { DockerHubOptions } from './DockerHubOptions'

export class DockerHubTagsCommand implements CommandModule<{}, DockerHubOptions> {
  command = '$0 <repository> [tag] [limit]'

  builder: Builder = {
    tagStartsWith: {
      array: true,
      default: [],
      type: 'string',
    },
    type: {
      choices: Object.keys(DockerHubTagType),
      default: DockerHubTagType.semver,
      type: 'string',
    },
  }

  handler = async (args: DockerHubOptions) => {
    const search = new DockerHubTags({
      repository: args.repository,
      tagStartsWith: args.tagStartsWith,
      type: args.type,
    })

    const searcher = await search.tags()

    if (args.tag && args.limit) {
      console.log(searcher.latest(args.tag, args.limit))
    } else if (args.tag) {
      console.log(searcher.latest(args.tag))
    } else {
      console.log(...searcher.enumerate().map(tag => tag.value))
    }
  }
}

export const TagsCommand = new DockerHubTagsCommand()
