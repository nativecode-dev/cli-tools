import { CommandModule, CommandBuilder } from 'yargs'
import { TaskSortOptions } from './TaskSortOptions'

export class TaskSort implements CommandModule<{}, TaskSortOptions> {
  aliases = ['sort', 's']
  command = 'sort'

  builder: CommandBuilder<{}, TaskSortOptions> = {}

  handler = (args: TaskSortOptions) => {
    return
  }
}
