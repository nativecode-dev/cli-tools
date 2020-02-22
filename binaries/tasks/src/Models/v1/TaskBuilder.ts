import { Task } from './Task'
import { TaskConfig } from './TaskConfig'
import { TaskEntry } from './TaskEntry'
import { TaskDefinition } from './TaskDefinitions'
import { TaskEntryType } from './TaskEntryType'

export interface TaskContext {
  config: TaskConfig
  name: string
  task: Task
}

export class TaskBuilder {
  protected expand(config: TaskConfig, value: Task | TaskDefinition[]): Task {
    if (Array.isArray(value)) {
      return { entries: this.fromArray(config, value as TaskDefinition[]) }
    } else if (typeof value === 'string') {
      return { entries: [this.createEntry(String(value))] }
    } else if (typeof value === 'object') {
      const task = value as Task
      return Object.assign({}, task, this.expand(config, task.entries))
    }
    return value as Task
  }

  protected fromArray(config: TaskConfig, definitions: TaskDefinition[]): TaskEntry[] {
    return definitions
      .map(task => {
        if (typeof task === 'string') {
          return this.fromString(config, String(task))
        }
        return [task]
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

      return this.fromArray(context.config, context.task.entries).map(entry => {
        entry.origin = name
        return entry
      })
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

  protected transform(config: TaskConfig): TaskConfig {
    return Object.keys(config.tasks)
      .map(key => ({ config, name: key, task: config.tasks[key] }))
      .filter(context => {
        if (context.task) {
          return true
        }
        return false
      })
      .map(context => {
        context.task = this.expand(context.config, context.task)
        return context
      })
      .reduce((result, context) => {
        result.tasks[context.name] = context.task
        return result
      }, config)
  }
}
