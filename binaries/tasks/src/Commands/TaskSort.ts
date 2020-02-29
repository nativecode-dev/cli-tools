import { fs } from '@nofrills/fs'
import { CommandModule, CommandBuilder } from 'yargs'

import { Sorters } from '../Sort/FileSort'
import { TaskSortOptions } from './TaskSortOptions'

export class TaskSort implements CommandModule<{}, TaskSortOptions> {
  aliases = ['sort', 's']
  command = 'sort <glob> [format]'

  builder: CommandBuilder<{}, TaskSortOptions> = {
    'dry-run': {
      alias: 'd',
      default: false,
      type: 'boolean',
    },
    ignored: {
      alias: 'i',
      array: true,
      default: ['node_modules', 'package.json', 'package-lock.json'],
      type: 'string',
    },
    'sort-array-properties': {
      boolean: true,
      default: false,
      type: 'boolean',
    },
  }

  handler = async (args: TaskSortOptions) => {
    const files = await fs.glob(`${args.cwd}/${args.glob}`)
    const results = await Sorters.sort(files, args)

    const errors = results.filter(result => result.error)
    const modified = results.filter(result => result.error === undefined)

    if (errors.length > 0) {
      return console.error(...errors)
    }

    return modified.map(x => console.log(args.dryRun ? '[dry-run]' : '', x.filename))
  }
}

export const TaskSortCommand = new TaskSort()
