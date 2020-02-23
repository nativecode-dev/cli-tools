import { TaskCommandOptions } from './TaskCommandOptions'

export interface TaskListOptions extends TaskCommandOptions {
  name?: string
  origin: boolean
}
