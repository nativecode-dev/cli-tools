import { CommandModule, Argv } from 'yargs'

import { ChestOptions } from './ChestOptions'

import { ProjectCommand } from './ChestProject'
import { WorkspaceCommand } from './ChestWorkspace'

import { ChestProjectOptions } from './ChestProjectOptions'
import { ChestWorkspaceOptions } from './ChestWorkspaceOptions'
import { OutputType } from '../Output/OutputType'

export class Chest implements CommandModule<{}, ChestOptions> {
  command = '$0 <command>'

  builder = (args: Argv<{}>): Argv<ChestOptions> => {
    return args
      .positional('command', {
        choices: ['project', 'workspace'],
        type: 'string',
      })
      .option('format', {
        alias: 'f',
        choices: Object.keys(OutputType),
        default: OutputType.text,
        type: 'string',
      })
      .command<ChestWorkspaceOptions>(WorkspaceCommand)
      .command<ChestProjectOptions>(ProjectCommand)
  }

  handler = (args: ChestOptions) => {
    return
  }
}

export const DefaultCommand = new Chest()
