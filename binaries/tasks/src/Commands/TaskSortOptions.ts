import { SortOptions } from '../Sort/SortOptions'
import { TaskCommandOptions } from './TaskCommandOptions'

export interface TaskSortOptions extends TaskCommandOptions, SortOptions {
  format: string
  glob: string
}
