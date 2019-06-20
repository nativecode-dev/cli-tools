import { Returns } from '@nofrills/patterns'

import { Logger } from '../Logging'
import { TaskBuilder } from '../TaskBuilder'
import { TaskArguments } from '../TaskArguments'
import { TaskConfig } from '../models/TaskConfig'

const log = Logger.extend('run')

export interface RunArguments extends TaskArguments {
  name: string
}

export default async function exec(builder: TaskBuilder, config: TaskConfig, ...tasks: string[]) {
  const results = await builder.run(tasks, config)

  const code: number = Math.max(
    ...results
      .map(result => ({ code: result.code, errors: result.errors, messages: result.messages, job: result.entry }))
      .map(result => Returns(result).after(() => (result.errors.length > 0 ? log.error(...result.errors) : void 0)))
      .map(result => result.code),
  )

  if (code !== 0) {
    process.exit(code)
  }
}
