import { TaskFull } from './TaskFull'
import { TaskShort } from './TaskShort'

export interface Task {
  [key: string]: TaskFull | TaskShort | number
  version: number
}
