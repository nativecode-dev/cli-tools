import yargs from 'yargs'

export * from './v1/DockerHubTags'
export * from './v1/DockerHubTagType'
export * from './v1/DockerHubTagSource'

import { TagsCommand } from './Commands/DockerHubTagsCommand'
import { DockerHubOptions } from './Commands/DockerHubOptions'

yargs
  .scriptName('dockerhub')
  .command<DockerHubOptions>(TagsCommand)
  .showHelpOnFail(true)
  .version()
  .parse()
