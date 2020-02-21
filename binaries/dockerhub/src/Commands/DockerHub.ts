import { CommandModule, Argv, CommandBuilder } from 'yargs'

import { LoginCommand } from './DockerHubLogin'
import { ReposCommand } from './DockerHubRepo'
import { TagsCommand } from './DockerHubTag'

import { DockerHubOptions } from '../DockerHubOptions'
import { DockerHubLoginOptions } from './DockerHubLoginOptions'
import { DockerHubRepoOptions } from './DockerHubRepoOptions'
import { DockerHubTagOptions } from './DockerHubTagOptions'

export class DockerHub implements CommandModule<{}, DockerHubOptions> {
  command = '$0 <command>'

  builder: CommandBuilder<{}, DockerHubOptions> = (args: Argv<{}>): Argv<DockerHubOptions> => {
    return args
      .positional('command', {
        choices: ['login', 'tags', 'repos'],
        describe: 'Note that you must first login before executing other commands.',
        type: 'string',
      })
      .command<DockerHubLoginOptions>(LoginCommand)
      .command<DockerHubRepoOptions>(ReposCommand)
      .command<DockerHubTagOptions>(TagsCommand)
  }

  handler = (args: DockerHubOptions) => {
    return
  }
}

export const DefaultCommand = new DockerHub()
