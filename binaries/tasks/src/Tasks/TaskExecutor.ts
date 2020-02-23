import execa from 'execa'

import { Subject } from 'rxjs'
import { Merge } from '@nnode/common'

import { TaskRunnerOptions } from './TaskRunnerOptions'

import { TaskEntry } from '../Models/TaskEntry'
import { TaskRunnerResult } from './TaskRunnerResult'
import { TaskEntryType } from '../Models/TaskEntryType'

import { TaskResultError } from '../Errors/TaskResultError'
import { Logger } from '../Logging'

export class TaskExecutor extends Subject<TaskRunnerResult> {
  private readonly log = Logger.extend('task-executor')

  async execute(entry: TaskEntry, runner: TaskRunnerOptions): Promise<TaskRunnerResult> {
    const options: execa.Options<string> = { detached: entry.type === TaskEntryType.detached }

    this.log.info('execute', [entry.name, ...entry.args].join(' '))

    if (runner.streaming) {
      const stream = this.stream(entry, options)
      const results = await stream
      this.complete()
      return this.createResult(entry, results)
    }

    const result = await this.sync(entry, options)
    this.complete()
    return result
  }

  private broadcast(result: TaskRunnerResult): TaskRunnerResult {
    if (result.exitCode !== 0) {
      this.error(new TaskResultError(result))
    } else {
      this.next(result)
    }

    this.log.trace('broadcast', result)

    return result
  }

  private createResult(entry: TaskEntry, results: execa.ExecaReturnValue): TaskRunnerResult {
    const result = {
      entry,
      command: [entry.name, ...entry.args].join(' '),
      exitCode: results.exitCode,
      stderr: results.stderr ? results.stderr.split('\n') : [],
      stdout: results.stdout ? results.stdout.split('\n') : [],
    }

    return this.broadcast(result)
  }

  private stream(entry: TaskEntry, options: execa.Options): execa.ExecaChildProcess {
    try {
      const child = execa(entry.name, entry.args, {
        ...options,
        ...{ stderr: process.stderr, stdin: process.stdin, stdout: process.stdout },
      })

      if (child.stderr) {
        child.stderr.pipe(process.stderr)
      }

      if (child.stdout) {
        child.stdout.pipe(process.stdout)
      }

      return child
    } catch (error) {
      this.error(error)
      process.exit(error.errno)
    }
  }

  private async sync(entry: TaskEntry, options: execa.Options): Promise<TaskRunnerResult> {
    const command = [entry.name].concat(entry.args).join(' ')

    try {
      const results = await execa.command(
        command,
        Merge<execa.Options>(options, {
          stderr: process.stderr,
          stdin: process.stdin,
          stdout: process.stdout,
        }),
      )

      if (results.exitCode !== 0) {
        throw new Error(`executor failed when running: ${command}`)
      }

      return this.createResult(entry, results)
    } catch (error) {
      if ([TaskEntryType.bail, TaskEntryType.exec].includes(entry.type) === false) {
        this.error(error)
      }

      process.exit(error.errno)
    }
  }
}
