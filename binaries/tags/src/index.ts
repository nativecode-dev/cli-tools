import yargs from 'yargs'

import { TagsCommand } from './Commands/DockerHubTag'
import { LoginCommand } from './Commands/DockerHubLogin'
import { ReposCommand } from './Commands/DockerHubRepo'

import { DockerHubTagOptions } from './Commands/DockerHubTagOptions'
import { DockerHubLoginOptions } from './Commands/DockerHubLoginOptions'
import { DockerHubRepoOptions } from './Commands/DockerHubRepoOptions'
import { DockerHubFormat } from './DockerHubFormat'

yargs
  .scriptName('dockerhub')
  .usage('$0 <command>')
  .command<DockerHubLoginOptions>(LoginCommand)
  .command<DockerHubRepoOptions>(ReposCommand)
  .command<DockerHubTagOptions>(TagsCommand)
  .option('format', {
    choices: Object.keys(DockerHubFormat),
    default: DockerHubFormat.text,
    type: 'string',
  })
  .showHelpOnFail(true)
  .version()
  .parse()
