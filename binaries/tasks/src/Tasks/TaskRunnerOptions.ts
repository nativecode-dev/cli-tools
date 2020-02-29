import { DictionaryOf } from '@nnode/common'

export interface TaskRunnerOptions {
  concurrency: number
  cwd: string
  env: DictionaryOf<string>
  streaming: boolean
}
