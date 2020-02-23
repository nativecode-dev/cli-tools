import { Task } from '../Models/Task'
import { TaskV2 } from '../Models/TaskV2'
import { TaskEntry } from '../Models/TaskEntry'
import { TaskEntryType } from '../Models/TaskEntryType'
import { TaskDefinition } from '../Models/TaskDefinitions'

interface TaskContext {
  config: TaskV2
  name: string
  task: TaskEntry[]
}

export class TaskBuilder {
  static from(config: TaskV2) {
    const builder = new TaskBuilder()
    return builder.transform(config)
  }

  protected expand(config: TaskV2, value: Task | TaskDefinition[] | string): TaskEntry[] {
    if (Array.isArray(value)) {
      return this.fromArray(config, value)
    }

    if (typeof value === 'string') {
      return [this.createEntry(value)]
    }

    return Object.assign({}, value, this.expand(config, value))
  }

  protected fromArray(config: TaskV2, definitions: TaskDefinition[]): TaskEntry[] {
    return definitions
      .map(task => {
        if (typeof task === 'string') {
          return this.fromString(config, task)
        }
        return [task]
      })
      .reduce<TaskEntry[]>((previous, current) => previous.concat(current), [])
  }

  protected fromString(config: TaskV2, command: string): TaskEntry[] {
    const regex = /^\[(.*)\]/g
    const matches = regex.exec(command)

    if (matches) {
      const name = matches[1]
      const context: TaskContext = {
        config,
        name,
        task: this.expand(config, config.steps[name]),
      }

      return this.fromArray(context.config, context.task).map(entry => {
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
      args: parts.slice(1),
      command: type === TaskEntryType.exec ? parts[0] : parts[0].substring(1),
      name: parts[0],
      type,
    }
  }

  protected type(command: string): TaskEntryType {
    const prefix = command[0]

    switch (prefix) {
      case TaskEntryType.bail:
        return TaskEntryType.bail

      case TaskEntryType.env:
        return TaskEntryType.env

      case TaskEntryType.spawn:
        return TaskEntryType.spawn

      case TaskEntryType.skip:
        return TaskEntryType.skip

      default:
        return TaskEntryType.exec
    }
  }

  protected transform(config: TaskV2): TaskV2 {
    const result = Object.keys(config.steps)
      .map(key => ({ config, name: key, task: config.steps[key] }))
      .filter(context => (context.task ? true : false))
      .map(context => {
        context.task = { entries: this.expand(config, context.task) }
        return context
      })
      .reduce((result, context) => {
        result.steps[context.name] = context.task
        return result
      }, config)

    return result
  }
}
