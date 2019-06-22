import chalk from 'chalk'

import { Is, DictionaryOf } from '@nofrills/types'
import { ScrubsInterceptor } from '@nofrills/scrubs'
import { CreateLogger, CreateOptions, Lincoln, Options, Log, LogMessageType } from '@nofrills/lincoln-debug'

import GLOBAL from './Globals'

const LoggerOptions: Options = CreateOptions('nofrills:tasks')

export type Colorizer = (text: string) => string

export interface Expressions extends DictionaryOf<RegExp> {
  cwd: RegExp
  env: RegExp
  info: RegExp
  taskexec: RegExp
  timing: RegExp
}

export const REGEX: Expressions = {
  cwd: new RegExp(`${GLOBAL.cwd}//?`, 'g'),
  env: new RegExp(/\$\{?[\w\d_]+\}?/g),
  error: new RegExp(/^\[\![\w\d_\-\:]+\]/g),
  info: new RegExp(/^\[\:[\w\d_\-\:]+\]/g),
  taskexec: new RegExp(/^\[[\w\d_\-\:]+\]/g),
  timing: new RegExp(/^\[@[^\]]+\]/g),
}

const COLORIZERS: Colorizer[] = [
  (text: string) => text.replace(REGEX.info, part => chalk.bold.yellow(part)),
  (text: string) => text.replace(REGEX.cwd, _ => ''),
  (text: string) => text.replace(REGEX.env, part => chalk.cyan(part)),
  (text: string) => text.replace(REGEX.error, part => chalk.bold.red(part)),
  (text: string) => text.replace(REGEX.taskexec, part => chalk.blue(part)),
  (text: string) => text.replace(REGEX.timing, part => chalk.green(part)),
  // NOTE: Default color should always be last in the list.
  (text: string) => text,
]

function colorize(parameters: any[]): string {
  const parameterize = (parameter: any) => COLORIZERS.reduce((result, colorizer) => colorizer(result), parameter)

  return parameters
    .map(parameter => {
      if (Is.array(parameter)) {
        return parameter.map(parameterize)
      }

      if (Is.string(parameter)) {
        return parameterize(parameter)
      }

      return chalk.grey(parameter)
    })
    .join(' ')
}

function stdout(log: Log): void {
  process.stdout.write(colorize(log.parameters))

  if (log.parameters.length) {
    process.stdout.write('\n')
  }
}

LoggerOptions.interceptors.register('colorize', async (log: Log) => {
  switch (log.type) {
    case LogMessageType.silly:
    case LogMessageType.trace:
      stdout(log)
      break
  }

  return Promise.resolve(log)
})

LoggerOptions.interceptors.register('scrubs', ScrubsInterceptor)

const Logger: Lincoln = CreateLogger(LoggerOptions)

export default Logger
