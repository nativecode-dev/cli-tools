import { Arguments } from 'yargs'

import { TaskRunnerOptions } from '../Tasks/TaskRunnerOptions'

export interface TaskCommandOptions extends Arguments {
  command: string
  config: string
  cwd: string
  runner?: TaskRunnerOptions
  logLevels: string[]
  noValidate: boolean
}
