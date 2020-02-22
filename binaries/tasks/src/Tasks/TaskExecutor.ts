import execa from 'execa'

import { Subject } from 'rxjs'

import { TaskRunnerOptions } from './TaskRunnerOptions'

import { TaskEntry } from '../Models/TaskEntry'
import { TaskRunnerResult } from './TaskRunnerResult'
import { TaskEntryType } from '../Models/TaskEntryType'

import { TaskResultError } from '../Errors/TaskResultError'

export class TaskExecutor extends Subject<TaskRunnerResult> {
  async execute(entry: TaskEntry, runner: TaskRunnerOptions): Promise<TaskRunnerResult> {
    const options: execa.Options<string> = {
      detached: entry.type === TaskEntryType.detached,
      stdin: process.stdin,
    }

    if (runner.streaming) {
      const stream = this.stream(entry, options)
      const results = await stream
      return this.createResult(entry, results)
    }

    const [_, result] = await this.nonstream(entry, options)
    return result
  }

  private broadcast(result: TaskRunnerResult): TaskRunnerResult {
    if (result.exitCode !== 0) {
      this.error(new TaskResultError(result))

      if (result.stderr.length > 0) {
        console.error('error', ...result.stderr)
      }

      if (result.stdout.length > 0) {
        console.log('stdout', ...result.stdout)
      }

      return result
    }

    this.next(result)

    return result
  }

  private async nonstream(
    entry: TaskEntry,
    options: execa.Options,
  ): Promise<[execa.ExecaReturnValue<string>, TaskRunnerResult]> {
    const command = [entry.name].concat(entry.args).join(' ')

    try {
      const results = await execa.command(command, options)

      if (results.exitCode !== 0) {
        throw new Error(`executor failed when running: ${command}`)
      }

      const result = this.createResult(entry, results)
      return [results, result]
    } catch (error) {
      if ([TaskEntryType.bail, TaskEntryType.exec].includes(entry.type) === false) {
        this.error(error)
      }

      process.exit(error.errno)
    }
  }

  private stream(entry: TaskEntry, options: execa.Options): execa.ExecaChildProcess<string> {
    try {
      return execa(entry.name, entry.args, options)
    } catch (error) {
      this.error(error)
      process.exit(error.errno)
    }
  }

  private createResult(entry: TaskEntry, results: execa.ExecaReturnValue<string>): TaskRunnerResult {
    const result = {
      entry,
      command: [entry.name, ...entry.args].join(' '),
      exitCode: results.exitCode,
      stderr: results.stderr ? results.stderr.split('\n') : [],
      stdout: results.stdout ? results.stdout.split('\n') : [],
    }

    return this.broadcast(result)
  }
}
