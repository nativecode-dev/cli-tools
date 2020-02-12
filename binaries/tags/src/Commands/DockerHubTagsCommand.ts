import { Arguments, CommandModule } from 'yargs'

import { Builder } from './Builder'
import { DockerTags } from '../DockerHubTags'

export interface DockerHubOptions extends Arguments {
  repository: string
  tag: string
}

export class DockerHubTags implements CommandModule<{}, DockerHubOptions> {
  command = '$0 <repository> <tag>'

  builder: Builder = {}

  handler = async (args: DockerHubOptions) => {
    const search = new DockerTags(args.repository)
    const searcher = await search.tags()
    console.log(`v${searcher.latest(args.tag)}`)
  }
}

export const DockerHubTagsCommand = new DockerHubTags()
