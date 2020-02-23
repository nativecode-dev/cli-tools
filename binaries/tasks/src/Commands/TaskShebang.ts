import { CommandModule, CommandBuilder } from 'yargs'

import { Shebang } from '../Tasks/Shebang'
import { TaskShebangOptions } from './TaskShebangOptions'

export class TaskShebang implements CommandModule<{}, TaskShebangOptions> {
  aliases = ['bang', 'shebang', '!']
  command = 'shebang'

  builder: CommandBuilder<{}, TaskShebangOptions> = {}

  handler = async (args: TaskShebangOptions) => {
    await Shebang.from(args.cwd)
  }
}

export const ShebangCommand = new TaskShebang()
