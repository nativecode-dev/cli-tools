import { CommandModule, CommandBuilder } from 'yargs'

import { taskConfigLoader } from '../Tasks/TaskConfigLoader'

import { TaskListOptions } from './TaskListOptions'
import { TaskConfigNotFound } from '../Errors/TaskConfigNotFound'

export class TaskList implements CommandModule<{}, TaskListOptions> {
  aliases = ['list', 'ls']
  command = 'list [name]'

  builder: CommandBuilder<{}, TaskListOptions> = {
    origin: {
      alias: 'o',
      default: false,
      type: 'boolean',
    },
  }

  handler = async (args: TaskListOptions) => {
    const tasks = await taskConfigLoader(args.cwd)

    if (tasks === null) {
      throw new TaskConfigNotFound()
    }

    if (args.name) {
      const entries = tasks.getStepEntries(args.name)
      const jsonstr = JSON.stringify(entries, null, 2)
      return console.log(jsonstr)
    }

    return tasks.getRunnableEntries().map((step) => console.log(step))
  }
}

export const TaskListCommand = new TaskList()
