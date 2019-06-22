import { TaskJob } from '../models/TaskJob'
import { TaskJobResult } from '../models/TaskJobResult'

export interface TaskRunnerAdapter {
  execute(job: TaskJob): Promise<TaskJobResult[]>
}
