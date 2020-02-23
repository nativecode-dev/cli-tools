import { TaskEntryType } from './TaskEntryType'

export interface TaskEntry {
  args: string[]
  command: string
  gid?: number
  name: string
  origin?: string
  shell?: string | boolean
  type: TaskEntryType
  uid?: number
}
