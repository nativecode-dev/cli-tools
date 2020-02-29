import { TaskCommandOptions } from './TaskCommandOptions'

export interface TaskRunOptions extends TaskCommandOptions {
  echo: boolean
  env: string[]
  name: string
}
