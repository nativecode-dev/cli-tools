import { CommandModule, CommandBuilder, Argv } from 'yargs'

import { ProjectListCommand } from './ProjectCommands/ProjectList'

import { ChestProjectOptions } from './ChestProjectOptions'
import { ProjectListOptions } from './ProjectCommands/ProjectListOptions'

export class ChestProject implements CommandModule<{}, ChestProjectOptions> {
  aliases = ['project', 'proj']
  command = 'project <subcommand>'

  builder: CommandBuilder<{}, ChestProjectOptions> = (args: Argv<{}>): Argv<ChestProjectOptions> => {
    return args.command<ProjectListOptions>(ProjectListCommand)
  }

  handler = (args: ChestProjectOptions) => {
    return
  }
}

export const ProjectCommand = new ChestProject()
