import { Is } from '@nofrills/types'
import { serial } from '@nofrills/patterns'

import { Task } from '../models/Task'
import { TaskJob } from '../models/TaskJob'
import { Lincoln, Logger } from '../Logging'
import { TaskConfig } from '../models/TaskConfig'
import { TaskJobResult } from '../models/TaskJobResult'
import { TaskRunnerAdapter } from './TaskRunnerAdapter'

export class TaskRunner {
  private readonly log: Lincoln = Logger.extend('task-runner')

  constructor(private readonly config: TaskConfig, private readonly adapter: TaskRunnerAdapter) {}

  async run(
    names: string[],
    cwd: string = process.cwd(),
    env: NodeJS.ProcessEnv = process.env,
  ): Promise<TaskJobResult[]> {
    this.log.debug('task-runner', names)

    env.FORCE_COLOR = 'true'
    env.PATH = `./node_modules/.bin:${env.PATH}`

    const jobs = this.createTaskJobs(cwd, env, names)
    const tasks = jobs.map(job => () => this.adapter.execute(job))

    return serial(tasks, () => Promise.resolve([])).then(results =>
      results.reduce((previous, current) => previous.concat(current), []),
    )
  }

  protected createTaskJobs(cwd: string, env: NodeJS.ProcessEnv, names: string[]): TaskJob[] {
    const task = (name: string) => {
      const collection = this.config.tasks[name]

      if (Is.array(collection)) {
        const result = { entries: this.config.tasks[name] } as Task
        return result
      }

      return this.config.tasks[name] as Task
    }

    return names.map(name => ({
      cwd,
      env,
      name,
      task: task(name),
    }))
  }
}