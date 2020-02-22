import yargs from 'yargs'

import { DefaultCommand } from './Commands/Chest'
import { ChestOptions } from './Commands/ChestOptions'

yargs
  .scriptName('chest')
  .usage('$0 <command>')
  .command<ChestOptions>(DefaultCommand)
  .recommendCommands()
  .showHelpOnFail(true)
  .version()
  .parse()
