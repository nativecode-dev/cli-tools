import { TaskV2 } from '../Models/TaskV2'
import { TaskEntry } from '../Models/TaskEntry'
import { TaskEntryType } from '../Models/TaskEntryType'

interface Step {
  name: string
  entries: TaskEntry[]
}

export class TaskNavigator {
  constructor(protected readonly task: TaskV2) {}

  getParallelEntries(name: string) {
    return this.steps(this.task)
      .filter(step => step.name === name)
      .map(step => step.entries.filter(entry => entry.type === TaskEntryType.parallel))
      .reduce((entries, entry) => entries.concat(entry), [])
      .filter(entry => entry.type !== TaskEntryType.skip)
  }

  getRunnableEntries(): string[] {
    return this.steps(this.task)
      .filter(step => step.name.includes(':') === false)
      .map(step => step.name)
  }

  getStepEntries(name: string) {
    return this.steps(this.task)
      .filter(step => step.name === name)
      .map(step => step.entries.filter(entry => entry.type !== TaskEntryType.parallel))
      .reduce((entries, entry) => entries.concat(entry), [])
      .filter(entry => entry.type !== TaskEntryType.skip)
  }

  private steps(task: TaskV2): Step[] {
    return Object.keys(task.steps).map<Step>(name => ({ name, entries: task.steps[name].entries }))
  }
}
