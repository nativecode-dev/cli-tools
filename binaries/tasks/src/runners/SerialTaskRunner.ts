import execa from 'execa'

import { serial } from '@nofrills/patterns'

import { Lincoln, Logger } from '../Logging'

import { TaskJob } from '../models/TaskJob'
import { TaskEntry } from '../models/TaskEntry'
import { TaskEntryType } from '../models/TaskEntryType'
import { TaskRunnerAdapter } from './TaskRunnerAdapter'
import { TaskJobResult, EmptyTaskJobResult } from '../models/TaskJobResult'
import { TaskConfigError } from '../errors'

export type TaskJobExec = () => Promise<TaskJobResult>

export interface TaskContext {
  entry: TaskEntry
  env: NodeJS.ProcessEnv
  job: TaskJob
}

export class SerialTaskRunner implements TaskRunnerAdapter {
  readonly stdin: NodeJS.ReadStream = process.stdin
  readonly stdout: NodeJS.WriteStream = process.stdout
  readonly stderr: NodeJS.WriteStream = process.stderr

  private readonly log: Lincoln = Logger.extend('serial')

  execute(job: TaskJob): Promise<TaskJobResult[]> {
    const createTask = (entry: TaskEntry) => {
      const args = entry.arguments || []
      this.log.debug('> ', entry.command, args.join(' '))
      return this.run({ entry, env: job.env, job })
    }

    const initiator = () => Promise.resolve([])

    if (job && job.task && job.task.entries) {
      return serial(job.task.entries.map(createTask), initiator)
    }

    return Promise.reject(new TaskConfigError('could not execute an invalid configuration'))
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
    const entry = context.entry

    const regex = /\${([A-Za-z,0-9,_]+[^$])}/g
    const substitutions = (entry.arguments || []).map(arg =>
      arg.replace(regex, (_, key) => (context.env[key] ? String(context.env[key]) : '')),
    )

    const options: execa.Options = {
      cwd: context.job.cwd,
      detached: context.entry.type === TaskEntryType.exec,
      env: context.env,
      gid: context.entry.gid,
      shell: context.job.task.shell,
      stdio: ['inherit', 'pipe', 'pipe'],
      uid: context.entry.uid,
    }

    console.log('[exec]', entry.command, substitutions.join(' '))

    const command = execa(entry.command, substitutions, options)

    if (!command.stderr || !command.stdout) {
      throw new Error('could not access stdout or stderr')
    }

    command.stderr.pipe(process.stderr)
    command.stdout.pipe(process.stdout)

    const { code, signal, stderr, stdout } = await command

    const result: TaskJobResult = {
      code,
      entry,
      errors: this.convertString(stderr),
      messages: this.convertString(stdout),
      signal,
    }

    this.log.debug('command', entry.command, result)

    return result
  }

  private convertString(value: string): string[] {
    return value && value !== '' ? [value] : []
  }
}
