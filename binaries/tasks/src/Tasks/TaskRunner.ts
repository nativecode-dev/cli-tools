import os from 'os'

import { all } from 'promise-parallel-throttle'

import { TaskEntry } from '../Models/TaskEntry'
import { TaskRunnerResult } from './TaskRunnerResult'

import { TaskExecutor } from './TaskExecutor'
import { TaskNavigator } from './TaskNavigator'
import { TaskRunnerOptions } from './TaskRunnerOptions'

const DefaultTaskRunnerOptions: TaskRunnerOptions = {
  ignoreEmptyLines: true,
  streaming: true,
}

export class TaskRunner {
  static from(
    task: TaskNavigator,
    name: string,
    options: Partial<TaskRunnerOptions> = {},
  ): Promise<TaskRunnerResult[]> {
    return new TaskRunner().run(task, name, options)
  }

  async run(task: TaskNavigator, name: string, options: Partial<TaskRunnerOptions> = {}): Promise<TaskRunnerResult[]> {
    const entries = task.getStepEntries(name).map(entry => () => this.exec(entry, options))
    const parallels = task.getParallelEntries(name).map(entry => () => this.exec(entry, options))
    const serial = all(entries, { maxInProgress: 1 })
    const parallel = all(parallels, { maxInProgress: os.cpus().length })
    const serialResults = await serial
    const parallelResults = await parallel
    return serialResults.concat(parallelResults)
  }

  private exec(entry: TaskEntry, options: Partial<TaskRunnerOptions> = {}): Promise<TaskRunnerResult> {
    const merged: TaskRunnerOptions = { ...DefaultTaskRunnerOptions, ...options }
    const executor = new TaskExecutor()
    return executor.execute(entry, merged)
  }
}
