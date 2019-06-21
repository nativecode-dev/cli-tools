import { TaskBuilder } from './TaskBuilder'
import { TaskConfig } from './models/TaskConfig'

export interface Globals {
  builder: TaskBuilder
  config: TaskConfig
}

const $GLOBAL: Partial<Globals> = {
  builder: undefined,
  config: undefined,
}

const GLOBAL: Globals = $GLOBAL as Globals

export default GLOBAL
