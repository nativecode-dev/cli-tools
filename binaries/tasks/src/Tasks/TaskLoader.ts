import { fs } from '@nofrills/fs'

import { TaskConfig as TaskV1Config } from '../Models/v1/TaskConfig'

import { Task as TaskV2 } from '../Models/v2/Task'

export const TASK_LOADER_FILES = ['package.json', '.tasks.json', 'tasks.json']

function convertFromV1(tasks: TaskV1Config): TaskV2 | null {
  return null
}

export async function taskLoader(filename: string): Promise<TaskV2 | null> {
  if (await fs.exists(filename)) {
    const pkgjson = await fs.json<any>(filename)

    if (pkgjson.tasks) {
      return convertFromV1(pkgjson.tasks)
    }

    const task = await TASK_LOADER_FILES.slice(1).reduce<Promise<TaskV2 | null>>(async (results, file) => {
      if (await fs.exists(file)) {
        const task = await fs.json<any>(file)

        if (task['version'] > 0) {
          return task
        }
      }

      return results
    }, Promise.resolve(null))

    if (task !== null) {
      return task
    }
  }

  throw new Error('failed to find any suitable task configuration files')
}
