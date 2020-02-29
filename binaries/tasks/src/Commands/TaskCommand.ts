import { CommandBuilder, CommandModule, Argv } from 'yargs'

import '../Sort'

import { TaskRunCommand } from './TaskRun'
import { TaskListCommand } from './TaskList'
import { ShebangCommand } from './TaskShebang'

import { TaskRunOptions } from './TaskRunOptions'
import { TaskListOptions } from './TaskListOptions'
import { TaskCommandOptions } from './TaskCommandOptions'
import { TaskShebangOptions } from './TaskShebangOptions'
import { TaskSortOptions } from './TaskSortOptions'
import { TaskSortCommand } from './TaskSort'

export class TaskCommand implements CommandModule<{}, TaskCommandOptions> {
  command = '$0 <command>'

  builder: CommandBuilder<{}, TaskCommandOptions> = (args: Argv<{}>) => {
    return args
      .positional('command', {
        choices: ['index', 'list', 'run', 'shebang', 'sort'],
        default: 'run',
        type: 'string',
      })
      .option('cwd', {
        default: process.cwd(),
        type: 'string',
      })
      .option('no-ignore-empty-lines', {
        boolean: true,
        default: true,
        type: 'boolean',
      })
      .option('log-levels', {
        alias: 'l',
        array: true,
        default: ['info'],
        type: 'string',
      })
      .option('no-validate', {
        alias: 'v',
        boolean: true,
        default: false,
        type: 'boolean',
      })
      .command<TaskListOptions>(TaskListCommand)
      .command<TaskRunOptions>(TaskRunCommand)
      .command<TaskShebangOptions>(ShebangCommand)
      .command<TaskSortOptions>(TaskSortCommand)
  }

  handler = (args: TaskCommandOptions) => {
    return
  }
}

export const DefaultCommand = new TaskCommand()
