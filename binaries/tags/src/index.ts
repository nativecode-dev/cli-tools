import yargs from 'yargs'

export * from './DockerHubTags'
export * from './DockerHubTagType'

import { TagsCommand } from './Commands/DockerHubTagsCommand'
import { DockerHubOptions } from './Commands/DockerHubOptions'

yargs
  .scriptName('dockerhub')
  .command<DockerHubOptions>(TagsCommand)
  .showHelpOnFail(true)
  .version()
  .parse()
