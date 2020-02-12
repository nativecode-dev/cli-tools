import yargs from 'yargs'

export * from './DockerHubTags'

import { DockerHubTagsCommand, DockerHubOptions } from './Commands/DockerHubTagsCommand'

yargs
  .scriptName('dockerhub')
  .command<DockerHubOptions>(DockerHubTagsCommand)
  .showHelpOnFail(true)
  .version()
  .parse()
