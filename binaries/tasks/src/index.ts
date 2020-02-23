import yargs from 'yargs'

import { DefaultCommand } from './Commands/TaskCommand'
import { TaskCommandOptions } from './Commands/TaskCommandOptions'

yargs
  .scriptName('tasks')
  .command<TaskCommandOptions>(DefaultCommand)
  .recommendCommands()
  .showHelpOnFail(process.env.TASKS_SHOW_HELP_ON_FAIL === 'false' || true)
  .version()
  .parse()
