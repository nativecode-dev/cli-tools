import { CommandBuilder, CommandModule, Argv } from 'yargs'

import { TaskRunCommand } from './TaskRun'
import { TaskListCommand } from './TaskList'
import { ShebangCommand } from './TaskShebang'

import { TaskRunOptions } from './TaskRunOptions'
import { TaskListOptions } from './TaskListOptions'
import { TaskCommandOptions } from './TaskCommandOptions'
import { TaskShebangOptions } from './TaskShebangOptions'

export class TaskCommand implements CommandModule<{}, TaskCommandOptions> {
  command = '$0 <command>'

  builder: CommandBuilder<{}, TaskCommandOptions> = (args: Argv<{}>) => {
    return args
      .positional('command', {
        choices: ['list', 'run'],
        default: 'run',
        type: 'string',
      })
      .option('cwd', {
        default: process.cwd(),
        type: 'string',
      })
      .option('no-ignore-empty-lines', {
        default: true,
        type: 'boolean',
      })
      .option('log-levels', {
        alias: 'l',
        array: true,
        default: ['info'],
        type: 'string',
      })
      .command<TaskListOptions>(TaskListCommand)
      .command<TaskRunOptions>(TaskRunCommand)
      .command<TaskShebangOptions>(ShebangCommand)
  }

  handler = (args: TaskCommandOptions) => {
    return
  }
}

export const DefaultCommand = new TaskCommand()