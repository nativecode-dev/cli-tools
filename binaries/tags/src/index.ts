import yargs from 'yargs'

export * from './DockerHubTags'
export * from './DockerHubTagType'

import { DockerHubOptions, TagsCommand } from './Commands/DockerHubTagsCommand'

yargs
  .scriptName('dockerhub')
  .command<DockerHubOptions>(TagsCommand)
  .showHelpOnFail(true)
  .version()
  .parse()
