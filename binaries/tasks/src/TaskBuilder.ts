import deepmerge from 'deepmerge'

import { Is } from '@nofrills/types'
import { Returns } from '@nofrills/patterns'
import { fs, CreateResolver, FileResolver } from '@nofrills/fs'

import Logger from './Logging'

import { Task } from './models/Task'
import { TaskEntry } from './models/TaskEntry'
import { TaskConfig } from './models/TaskConfig'
import { TaskRunner } from './runners/TaskRunner'
import { TaskEntryType } from './models/TaskEntryType'
import { TaskJobResult } from './models/TaskJobResult'
import { TaskDefinition } from './models/TaskDefinitions'
import { SerialTaskRunner } from './runners/SerialTaskRunner'
import { TaskEvent } from './TaskEvent'
import { EventEmitter } from 'events'

export interface TaskContext {
  config: TaskConfig
  name: string
  task: Task
}

export class TaskBuilder extends EventEmitter {
  private readonly log = Logger.extend('builder')
  private readonly resolver: FileResolver

  constructor(
    public readonly cwd: string,
    private readonly definitions: string[],
    private readonly config: TaskConfig = { tasks: {} },
  ) {
    super()
    this.config = this.transform(config)
    this.resolver = CreateResolver(cwd)
  }

  static dir(cwd: string, definitions: string[] = ['tasks.json', 'package.json']): TaskBuilder {
    return new TaskBuilder(cwd, definitions)
  }

  static from(config: TaskConfig): TaskBuilder {
    return new TaskBuilder(process.cwd(), [], config)
  }

  async build(): Promise<TaskConfig> {
    const filenames = await this.resolve()

    const configs = await Promise.all(
      filenames
        .map(filename => {
          this.emit(TaskEvent.ConfigFile, filename)
          return filename
        })
        .map(async filename => {
          try {
            const config = await fs.json<TaskConfig>(filename)
            const transformed = this.transform({ tasks: config.tasks })
            this.emit(TaskEvent.Transform, transformed)
            this.log.debug('task-config', transformed.tasks)
            return transformed
          } catch (error) {
            this.log.error(error)
            return this.config
          }
        }),
    )

    return configs.reduce((config, current) => deepmerge(config, current), this.config)
  }

  async run(names: string[], config?: TaskConfig): Promise<TaskJobResult[]> {
    const serial = new SerialTaskRunner()
    const executeHandler = (entry: TaskEntry) => this.emit(TaskEvent.Execute, entry)
    const resultsHandler = (results: TaskJobResult[]) => this.emit(TaskEvent.Results, results)
    serial.on(TaskEvent.Execute, executeHandler)
    serial.on(TaskEvent.Results, resultsHandler)

    try {
      config = config || (await this.build())
      const runner = new TaskRunner(config, serial)
      this.log.debug('run', names, config)
      const results = await runner.run(names, this.cwd)
      this.log.debug('run-results', ...results)
      return results
    } finally {
      serial.off(TaskEvent.Execute, resultsHandler)
      serial.off(TaskEvent.Execute, executeHandler)
    }
  }

  protected expand(config: TaskConfig, value: Task | TaskDefinition[]): Task {
    this.log.debug('expand', value)

    if (Is.array(value)) {
      return { entries: this.fromArray(config, value as TaskDefinition[]) }
    } else if (Is.string(value)) {
      return { entries: [this.createEntry(String(value))] }
    } else if (Is.object(value)) {
      const task = value as Task
      return Object.assign({}, task, this.expand(config, task.entries))
    }
    return value as Task
  }

  protected fromArray(config: TaskConfig, definitions: TaskDefinition[]): TaskEntry[] {
    return definitions
      .map(task => {
        if (Is.string(task)) {
          return this.fromString(config, String(task))
        }
        return [task as TaskEntry]
      })
      .reduce<TaskEntry[]>((previous, current) => previous.concat(current), [])
  }

  protected fromString(config: TaskConfig, command: string): TaskEntry[] {
    const regex = /^\[(.*)\]/g
    const matches = regex.exec(command)

    if (matches) {
      const name = matches[1]
      const context: TaskContext = {
        config,
        name,
        task: this.expand(config, config.tasks[name]),
      }

      return this.fromArray(context.config, context.task.entries).map(entry =>
        Returns(entry).after(() => (entry.origin = name)),
      )
    }

    return [this.createEntry(command)]
  }

  protected createEntry(command: string): TaskEntry {
    const parts = command.split(' ')
    const type = this.type(parts[0])

    return {
      arguments: parts.slice(1),
      command: type === TaskEntryType.spawn ? parts[0] : parts[0].substring(1),
      name: parts[0],
      type,
    }
  }

  protected type(command: string): TaskEntryType {
    const prefix = command[0]

    switch (prefix) {
      case TaskEntryType.bail:
        return TaskEntryType.bail

      case TaskEntryType.capture:
        return TaskEntryType.capture

      case TaskEntryType.env:
        return TaskEntryType.env

      case TaskEntryType.exec:
        return TaskEntryType.exec

      case TaskEntryType.skip:
        return TaskEntryType.skip

      default:
        return TaskEntryType.spawn
    }
  }

  protected async resolve(): Promise<string[]> {
    const resolved = await Promise.all(this.definitions.map(definition => this.resolver.find(definition)))
    const filtered = resolved.filter(files => files.length)
    this.log.debug('resolve', ...filtered)
    return resolved.reduce((results, current) => results.concat(...current), [])
  }

  protected transform(config: TaskConfig): TaskConfig {
    return Object.keys(config.tasks)
      .map(key => ({ config, name: key, task: config.tasks[key] }))
      .filter(context => {
        if (context.task) {
          return true
        }
        this.log.error(`failed to find task: ${context.name}`)
        return false
      })
      .map(context => {
        context.task = this.expand(context.config, context.task)
        return context
      })
      .reduce((result, context) => {
        this.log.debug('transform', result.tasks[context.name], context.task)
        result.tasks[context.name] = context.task
        return result
      }, config)
  }
}
