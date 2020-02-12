import { Arguments, CommandModule } from 'yargs'

import { Builder } from './Builder'
import { DockerHubTags } from '../DockerHubTags'

export interface DockerHubOptions extends Arguments {
  repository: string
  tag: string
}

export class DockerHubTagsCommand implements CommandModule<{}, DockerHubOptions> {
  command = '$0 <repository> <tag>'

  builder: Builder = {}

  handler = async (args: DockerHubOptions) => {
    const search = new DockerHubTags(args.repository)
    const searcher = await search.tags()
    console.log(`v${searcher.latest(args.tag)}`)
  }
}

export const TagsCommand = new DockerHubTagsCommand()
