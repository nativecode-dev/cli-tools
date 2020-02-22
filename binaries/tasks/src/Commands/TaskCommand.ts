import { fs } from '@nofrills/fs'
import { CommandBuilder, CommandModule } from 'yargs'

import { TaskOptions } from './TaskOptions'
import { TASK_LOADER_FILES, taskLoader } from '../Tasks/TaskLoader'

export class TaskCommand implements CommandModule<{}, TaskOptions> {
  aliases = ['task', 'tasks']
  command = '$0'

  builder: CommandBuilder<{}, TaskOptions> = {
    config: {
      alias: 'c',
      choices: TASK_LOADER_FILES,
      default: 'package.json',
      type: 'string',
    },
    cwd: {
      default: process.cwd(),
      type: 'string',
    },
  }

  handler = async (args: TaskOptions) => {
    const filename = fs.join(args.cwd, args.config)
    const task = await taskLoader(filename)
    console.log(task)
  }
}

export const DefaultCommand = new TaskCommand()
