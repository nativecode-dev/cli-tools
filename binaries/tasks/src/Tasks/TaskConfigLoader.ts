import { fs } from '@nofrills/fs'

import { TaskV1 } from '../Models/TaskV1'
import { TaskV2 } from '../Models/TaskV2'
import { TaskBuilder } from './TaskBuilder'
import { TaskNavigator } from './TaskNavigator'

export const TASK_LOADER_FILES = ['.tasks.json', 'tasks.json']

function convertFromV1(task: TaskV1): TaskV2 {
  return { options: {}, steps: task.tasks }
}

function isTaskArray(value: any): boolean {
  const containsTasks = typeof value === 'object'
  const containsTaskCommands = Object.keys(value).some(key => Array.isArray(value[key]))
  return containsTasks && containsTaskCommands
}

async function fromPackage(cwd: string): Promise<TaskV2 | null> {
  const filename = fs.join(cwd, 'package.json')

  if (await fs.exists(filename)) {
    const task = await fs.json<TaskV1>(filename)

    if (task.tasks && isTaskArray(task.tasks)) {
      return convertFromV1(task)
    }
  }

  return null
}

async function fromTaskConfig(cwd: string): Promise<TaskV2 | null> {
  return TASK_LOADER_FILES.slice(1).reduce<Promise<TaskV2 | null>>(async (results, file) => {
    const taskfile = fs.join(cwd, file)

    if (await fs.exists(taskfile)) {
      const config = await fs.json<any>(taskfile)

      if (isTaskArray(config)) {
        return convertFromV1({ tasks: config })
      }

      if (config.tasks) {
        return convertFromV1(config)
      }

      if (config.steps || config.options) {
        return config
      }
    }

    return results
  }, Promise.resolve(null))
}

/**
 * Finds a configuration file where possible. The order in which it performs
 * the search is as follows:
 *   - looks for a .tasks.json or tasks.json
 *   - looks in package.json
 *
 * @cwd string
 * @returns @TaskV2 or @null
 */
export async function taskConfigLoader(cwd: string): Promise<TaskNavigator | null> {
  const taskFromConfig = await fromTaskConfig(cwd)

  if (taskFromConfig !== null) {
    const config = TaskBuilder.from(taskFromConfig)
    return new TaskNavigator(config)
  }

  const tasksFromPackage = await fromPackage(cwd)

  if (tasksFromPackage !== null) {
    const config = TaskBuilder.from(tasksFromPackage)
    return new TaskNavigator(config)
  }

  throw new Error('failed to find any suitable task configuration files')
}
