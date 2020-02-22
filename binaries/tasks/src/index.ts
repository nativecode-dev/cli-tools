import yargs from 'yargs'

import { TaskOptions } from './Commands/TaskOptions'
import { DefaultCommand } from './Commands/TaskCommand'

yargs
  .scriptName('tasks')
  .usage('$0 <command>')
  .command<TaskOptions>(DefaultCommand)
  .recommendCommands()
  .showHelpOnFail(true)
  .version()
  .parse()
