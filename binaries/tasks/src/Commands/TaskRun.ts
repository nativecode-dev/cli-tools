import { DictionaryOf } from '@nnode/common'
import { CommandModule, CommandBuilder } from 'yargs'

import { TaskRunner } from '../Tasks/TaskRunner'
import { TaskRunOptions } from './TaskRunOptions'
import { taskConfigLoader } from '../Tasks/TaskConfigLoader'
import { TaskConfigNotFound } from '../Errors/TaskConfigNotFound'

function resolveEnvVariables(env: string[]): DictionaryOf<string> {
  return env
    .map(envstr => {
      const parts = envstr.split('=')
      const name = parts[0]
      const value = parts[1]
      return [name, value]
    })
    .reduce<DictionaryOf<string>>((result, [name, value]) => {
      result[name] = value
      return result
    }, {})
}

export class TaskRun implements CommandModule<{}, TaskRunOptions> {
  aliases = ['run', 'r', '']
  command = '$0 <name>'

  builder: CommandBuilder<{}, TaskRunOptions> = {
    'dry-run': {
      alias: 'd',
      default: false,
      type: 'boolean',
    },
    env: {
      alias: 'e',
      array: true,
      default: [],
      type: 'string',
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
    const env = resolveEnvVariables(args.env)

    if (args.dryRun) {
      return entries.map(entry => console.log('execute', [entry.name, ...entry.args].join(' ')))
    }

    if (args.name) {
      const results = await TaskRunner.from(task, args.name, { env, cwd: args.cwd })
      const failed = results.filter(result => result.exitCode !== 0)
      failed.map(result => console.error(result.exitCode))
      return
    }

    throw new Error('must provide a top-level name to execute')
  }
}

export const TaskRunCommand = new TaskRun()
