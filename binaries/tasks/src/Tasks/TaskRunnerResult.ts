import { TaskEntry } from '../Models/TaskEntry'

export interface TaskRunnerResult {
  command: string
  entry: TaskEntry
  exitCode: number
  stderr: string[]
  stdout: string[]
}
