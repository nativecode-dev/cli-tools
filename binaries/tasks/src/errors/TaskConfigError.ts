import { TaskConfig } from '../models/TaskConfig'

export class TaskConfigError extends Error {
  constructor(readonly config: TaskConfig, message: string) {
    super(message)
  }
}
