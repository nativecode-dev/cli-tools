import { Task } from '../models/Task'

export class TaskJobError extends Error {
  constructor(readonly task: Task, readonly message: string) {
    super(message)
  }
}
