import { CommandModule, CommandBuilder } from 'yargs'

import { TaskRunner } from '../Tasks/TaskRunner'
import { TaskRunOptions } from './TaskRunOptions'
import { taskConfigLoader } from '../Tasks/TaskConfigLoader'
import { TaskConfigNotFound } from '../Errors/TaskConfigNotFound'

export class TaskRun implements CommandModule<{}, TaskRunOptions> {
  aliases = ['run', 'r', '']
  command = '$0 <name>'

  builder: CommandBuilder<{}, TaskRunOptions> = {
    echo: {
      alias: 'e',
      default: false,
      type: 'boolean',
    },
    ignored: {
      alias: 'i',
      array: true,
      default: ['node_modules'],
      type: 'string',
    },
  }

  handler = async (args: TaskRunOptions) => {
    const task = await taskConfigLoader(args.cwd)

    if (task === null) {
      throw new TaskConfigNotFound()
    }

    const entries = task.getStepEntries(args.name)

    if (args.echo) {
      return entries.map(entry => console.log('execute', [entry.name, ...entry.args].join(' ')))
    }

    if (args.name) {
      const results = await TaskRunner.from(args.cwd, task, args.name)
      const failed = results.filter(result => result.exitCode !== 0)
      failed.map(result => console.error(result.exitCode))
      return
    }

    throw new Error('must provide a top-level name to execute')
  }
}

export const TaskRunCommand = new TaskRun()
