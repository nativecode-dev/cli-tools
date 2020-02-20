import { Arguments } from 'yargs'

import { OutputType } from '../Output/OutputType'

export interface ChestOptions extends Arguments {
  command: string
  cwd: string
  format: OutputType
}
