import { TaskRunnerResult } from '../Tasks/TaskRunnerResult'

export class TaskResultError extends Error {
  constructor(public readonly result: TaskRunnerResult) {
    super(`${result.command} returned error code ${result.exitCode}`)
  }
}
