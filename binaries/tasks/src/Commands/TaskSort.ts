import { fs } from '@nofrills/fs'
import { CommandModule, CommandBuilder } from 'yargs'

import { Sorters } from '../Sort/FileSort'
import { TaskSortOptions } from './TaskSortOptions'

export class TaskSort implements CommandModule<{}, TaskSortOptions> {
  aliases = ['sort', 's']
  command = 'sort <glob> [format]'

  builder: CommandBuilder<{}, TaskSortOptions> = {}

  handler = async (args: TaskSortOptions) => {
    const files = await fs.glob(`${args.cwd}/${args.glob}`)
    const errors = await Sorters.sort(files)

    if (errors.length > 0) {
      console.log(...errors)
    }

    console.log(...files)
  }
}

export const TaskSortCommand = new TaskSort()
