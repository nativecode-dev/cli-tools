import { CommandModule, CommandBuilder } from 'yargs'

import { TaskIndexOptions } from './TaskIndexOptions'

export class TaskIndex implements CommandModule<{}, TaskIndexOptions> {
  aliases = ['index', 'idx']
  command = 'index'

  builder: CommandBuilder<{}, TaskIndexOptions> = {}

  handler = (args: TaskIndexOptions) => {
    return
  }
}
