import yargs from 'yargs'

import { TaskCommandOptions } from './Commands/TaskCommandOptions'
import { DefaultCommand } from './Commands/TaskCommand'

yargs
  .scriptName('tasks')
  .command<TaskCommandOptions>(DefaultCommand)
  .recommendCommands()
  .showHelpOnFail(process.env.TASKS_SHOW_HELP_ON_FAIL === 'true' || false)
  .version()
  .parse()
