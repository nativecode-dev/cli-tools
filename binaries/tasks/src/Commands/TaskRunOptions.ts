import { TaskCommandOptions } from './TaskCommandOptions'

export interface TaskRunOptions extends TaskCommandOptions {
  dryRun: boolean
  env: string[]
  name: string
}
