import os from 'os'

import { Subscription } from 'rxjs'
import { Merge } from '@nnode/common'
import { all } from 'promise-parallel-throttle'

import { Logger } from '../Logging'
import { TaskExecutor } from './TaskExecutor'
import { TaskNavigator } from './TaskNavigator'
import { TaskRunnerResult } from './TaskRunnerResult'
import { TaskRunnerOptions } from './TaskRunnerOptions'

import { TaskEntry } from '../Models/TaskEntry'

const DefaultTaskRunnerOptions: TaskRunnerOptions = {
  concurrency: os.cpus().length,
  ignoreEmptyLines: true,
  streaming: true,
}

export class TaskRunner {
  private readonly log = Logger.extend('task-runner')

  static from(
    cwd: string,
    task: TaskNavigator,
    name: string,
    options: Partial<TaskRunnerOptions> = {},
  ): Promise<TaskRunnerResult[]> {
    return new TaskRunner().run(cwd, task, name, options)
  }

  async run(
    cwd: string,
    task: TaskNavigator,
    name: string,
    options: Partial<TaskRunnerOptions> = {},
  ): Promise<TaskRunnerResult[]> {
    const merged: TaskRunnerOptions = Merge<TaskRunnerOptions>(DefaultTaskRunnerOptions, options)

    this.log.trace('run', merged)

    const entries = task.getStepEntries(name).map(entry => () => this.exec(cwd, entry, merged))
    const parallels = task.getParallelEntries(name).map(entry => () => this.exec(cwd, entry, merged))

    this.log.trace('run-serial', entries.length, 'run-parallel', parallels.length)

    const serial = all(entries, { maxInProgress: 1 })
    const parallel = all(parallels, { maxInProgress: merged.concurrency })

    const serialResults = await serial
    const parallelResults = await parallel

    return serialResults.concat(parallelResults)
  }

  private async exec(cwd: string, entry: TaskEntry, options: TaskRunnerOptions): Promise<TaskRunnerResult> {
    const executor = new TaskExecutor()

    const sub: Subscription = executor.subscribe(
      result => console.log(...result.stdout),
      error => console.error(error.message),
      () => sub.unsubscribe(),
    )

    return executor.execute(cwd, entry, options)
  }
}
