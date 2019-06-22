import execa from 'execa'

import { EventEmitter } from 'events'
import { serial } from '@nofrills/patterns'

import Logger from '../Logging'

import { Is } from '@nofrills/types'
import { TaskEvent } from '../TaskEvent'
import { TaskJob } from '../models/TaskJob'
import { TaskEntry } from '../models/TaskEntry'
import { TaskEntryType } from '../models/TaskEntryType'
import { TaskRunnerAdapter } from './TaskRunnerAdapter'
import { TaskJobResult, EmptyTaskJobResult } from '../models/TaskJobResult'

export type TaskJobExec = () => Promise<TaskJobResult>

export interface TaskContext {
  entry: TaskEntry
  env: NodeJS.ProcessEnv
  job: TaskJob
}

export class SerialTaskRunner extends EventEmitter implements TaskRunnerAdapter {
  private readonly log = Logger.extend('serial')

  async execute(job: TaskJob): Promise<TaskJobResult[]> {
    const createTask = (entry: TaskEntry) => {
      const args = entry.arguments || []
      this.log.debug('> ', entry.command, args.join(' '))
      return this.run({ entry, env: job.env, job })
    }

    if (job && job.task && job.task.entries) {
      return serial(job.task.entries.map(createTask), this.initiator)
    }

    const result = await this.initiator()

    const taskNotFound: TaskJobResult = {
      code: Infinity,
      entry: {
        command: job.name,
      },
      errors: [`could not find job named: ${job.name}`],
      messages: [],
      signal: null,
    }

    return [...result, taskNotFound]
  }

  protected run(context: TaskContext): TaskJobExec {
    const entry = context.entry

    this.log.debug('execute', context.job.cwd, entry)

    switch (entry.type) {
      case TaskEntryType.skip:
        return async () => EmptyTaskJobResult(entry)

      case TaskEntryType.env:
        return async () => {
          context.env[entry.command] = entry.arguments ? entry.arguments[0] : undefined
          return EmptyTaskJobResult(entry)
        }

      default:
        return () => this.exec(context)
    }
  }

  protected async exec(context: TaskContext): Promise<TaskJobResult> {
    const entry = Is.string(context.entry) ? this.entryify(String(context.entry)) : context.entry

    const regex = /\${([A-Za-z,0-9,_]+[^$])}/g
    const substitutions = (entry.arguments || []).map(arg =>
      arg.replace(regex, (_, key) => (context.env[key] ? String(context.env[key]) : '')),
    )

    const options: execa.Options = {
      cwd: context.job.cwd,
      detached: context.entry.type === TaskEntryType.exec,
      env: context.env,
      gid: context.entry.gid,
      shell: context.job.task.shell || true,
      stdio: ['inherit', 'pipe', 'pipe'],
      uid: context.entry.uid,
    }

    this.emit(TaskEvent.Execute, entry)
    const cmdproc = execa(entry.command, substitutions, options)

    if (cmdproc.stderr && cmdproc.stdout) {
      cmdproc.stderr.pipe(process.stderr)
      cmdproc.stdout.pipe(process.stdout)
    }

    const { code, signal, stderr, stdout } = await cmdproc

    const result: TaskJobResult = {
      code,
      entry,
      errors: this.convertString(stderr),
      messages: this.convertString(stdout),
      signal,
    }

    this.emit(TaskEvent.Results, result)

    this.log.debug('command', entry.command, result)

    return result
  }

  private convertString(value: string): string[] {
    return value && value !== '' ? [value] : []
  }

  private entryify(command: string): TaskEntry {
    const parts = command.split(' ')

    return {
      arguments: parts.slice(1),
      command: parts[0],
    }
  }

  private initiator(): Promise<TaskJobResult[]> {
    return Promise.resolve([])
  }
}
