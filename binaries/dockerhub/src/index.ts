import yargs from 'yargs'

import { DockerHubFormat } from './DockerHubFormat'
import { DockerHubOptions } from './DockerHubOptions'
import { DefaultCommand } from './Commands/DockerHub'

yargs
  .scriptName('dockerhub')
  .usage('$0 <command>')
  .command<DockerHubOptions>(DefaultCommand)
  .option('format', {
    choices: Object.keys(DockerHubFormat),
    default: DockerHubFormat.text,
    type: 'string',
  })
  .recommendCommands()
  .showHelpOnFail(true)
  .version()
  .parse()
