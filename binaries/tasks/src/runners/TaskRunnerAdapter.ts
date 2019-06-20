import { TaskJob } from '../models/TaskJob'
import { TaskJobResult } from '../models/TaskJobResult'

export interface TaskRunnerAdapter {
  readonly stdin: NodeJS.ReadStream
  readonly stdout: NodeJS.WriteStream
  readonly stderr: NodeJS.WriteStream
  execute(job: TaskJob): Promise<TaskJobResult[]>
}
