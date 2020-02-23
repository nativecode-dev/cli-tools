import { TaskOptions } from './TaskOptions'
import { TaskDefinitions } from './TaskDefinitions'

export interface TaskV2 {
  options: TaskOptions
  steps: TaskDefinitions
}
