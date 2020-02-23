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
    const options: execa.Options<string> = {
      detached: entry.type === TaskEntryType.detached,
      shell: entry.type === TaskEntryType.shell
    }

    this.log.info('execute', [entry.name, ...entry.args].join(' '))

    try {
      if (runner.streaming) {
        const stream = this.stream(entry, options)
        const results = await stream
        this.complete()
        return this.createResult(entry, results)
      }

      const result = await this.sync(entry, options)
      this.complete()
      return result
    } catch (error) {
      this.error(error)

      if (this.shouldBail(entry)) {
        process.exit(1)
      }

      return {
        entry,
        command: [entry.name, ...entry.args].join(' '),
        exitCode: process.exitCode || 1,
        stderr: [],
        stdout: [],
      }
    }
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
  }

  private async sync(entry: TaskEntry, options: execa.Options): Promise<TaskRunnerResult> {
    const command = [entry.name].concat(entry.args).join(' ')

    const results = await execa.command(
      command,
      Merge<execa.Options>(options, {
        stderr: process.stderr,
        stdin: process.stdin,
        stdout: process.stdout,
      }),
    )

    if (results.exitCode !== 0 && this.shouldBail(entry)) {
      throw new Error(`executor failed when running: ${command}`)
    }

    return this.createResult(entry, results)
  }

  private shouldBail(entry: TaskEntry): boolean {
    return [TaskEntryType.bail, TaskEntryType.exec, TaskEntryType.parallel, TaskEntryType.spawn].includes(entry.type)
  }
}
