export class TaskConfigNotFound extends Error {
  constructor() {
    super('task configuration was not found')
  }
}
