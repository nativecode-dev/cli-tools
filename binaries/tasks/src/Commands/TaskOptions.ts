import { Arguments } from 'yargs'

export interface TaskOptions extends Arguments {
  config: string
  cwd: string
}
