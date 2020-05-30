import os from 'os'
import { all } from 'promise-parallel-throttle'

import { Subscription } from 'rxjs'
import { Merge } from '@nnode/common'

import { Logger } from '../Logging'
import { TaskExecutor } from './TaskExecutor'
import { TaskNavigator } from './TaskNavigator'
import { TaskRunnerResult } from './TaskRunnerResult'
import { TaskRunnerOptions } from './TaskRunnerOptions'

import { TaskEntry } from '../Models/TaskEntry'

const DefaultTaskRunnerOptions: TaskRunnerOptions = {
  concurrency: os.cpus().length,
  cwd: process.cwd(),
  env: {},
  streaming: true,
}

export class TaskRunner {
  private readonly log = Logger.extend('task-runner')

  constructor(protected readonly task: TaskNavigator) {}

  static from(
    task: TaskNavigator,
    name: string,
    options: Partial<TaskRunnerOptions> = {},
  ): Promise<TaskRunnerResult[]> {
    const runner = new TaskRunner(task)
    return runner.run(name, options)
  }

  async run(name: string, options: Partial<TaskRunnerOptions> = {}): Promise<TaskRunnerResult[]> {
    const merged: TaskRunnerOptions = Merge<TaskRunnerOptions>(DefaultTaskRunnerOptions, options)
    this.log.trace('run', merged)

    const parallels = this.task.getParallelEntries(name).map((entry) => () => this.exec(entry, merged))
    const steps = this.task.getStepEntries(name).map((entry) => () => this.exec(entry, merged))
    this.log.trace('run-serial', steps.length, 'run-parallel', parallels.length)

    const serial = all(steps, { maxInProgress: 1 })
    const parallel = all(parallels, { maxInProgress: merged.concurrency })

    const serialResults = await serial
    const parallelResults = await parallel

    return serialResults.concat(parallelResults)
  }

  private async exec(entry: TaskEntry, options: TaskRunnerOptions): Promise<TaskRunnerResult> {
    const executor = new TaskExecutor()

    const sub: Subscription = executor.subscribe(
      (result) => console.log(...result.stdout),
      (error) => console.error(error.message),
      () => sub.unsubscribe(),
    )

    return executor.execute(entry, options)
  }
}
