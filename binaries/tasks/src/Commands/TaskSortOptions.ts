import { TaskCommandOptions } from './TaskCommandOptions'

export interface TaskSortOptions extends TaskCommandOptions {
  format: string
  glob: string
}
