export * from './DockerHubClient'
export * from './Tag'
export * from './TagMap'
export * from './TagMatch'
export * from './TagMatcher'
export * from './TagResolve'
export * from './TagResolveAll'
export * from './TagSort'
export * from './TagVersion'
export * from './TagVersionParse'

export * from './Matchers'
export * from './Models'
export * from './Resources'

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
