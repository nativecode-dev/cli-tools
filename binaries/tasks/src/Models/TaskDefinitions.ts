import { TaskEntry } from './TaskEntry'
import { TaskEntries } from './TaskEntries'

export type TaskDefinition = TaskEntry | string

export interface TaskDefinitions {
  [name: string]: TaskEntries
}
