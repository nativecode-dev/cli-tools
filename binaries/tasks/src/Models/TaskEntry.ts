import { TaskEntryType } from './TaskEntryType'

export interface TaskEntry {
  args: string[]
  command: string
  gid?: number
  name: string
  origin?: string
  type: TaskEntryType
  uid?: number
}
