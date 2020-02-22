import { CommandModule, CommandBuilder } from 'yargs'

import { TaskShebangOptions } from './TaskShebangOptions'
import { Shebang } from '../Shebang'

export class TaskShebang implements CommandModule<{}, TaskShebangOptions> {
  aliases = ['shebang', '!']
  command = 'shebang'

  builder: CommandBuilder<{}, TaskShebangOptions> = {}

  handler = async (args: TaskShebangOptions) => {
    await Shebang.from(args.cwd)
  }
}

export const ShebangCommand = new TaskShebang()
