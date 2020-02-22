import { TaskCommand } from './TaskCommand'

export interface TaskFull {
  commands: TaskCommand[]
  name: string
}
