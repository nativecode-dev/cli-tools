import chalk from 'chalk'

import { Is, DictionaryOf } from '@nofrills/types'
import { ScrubsInterceptor } from '@nofrills/scrubs'
import { CreateLogger, CreateOptions, Lincoln, Options, Log, LogMessageType } from '@nofrills/lincoln-debug'

const LoggerOptions: Options = CreateOptions('nofrills:tasks')

export type Colorizer = (text: string) => string

export interface Expressions extends DictionaryOf<RegExp> {
  braces: RegExp
  brackets: RegExp
  env: RegExp
}

export const REGEX: Expressions = {
  braces: new RegExp(/[^$]\{[\w\d_]+\}/g),
  brackets: new RegExp(/\[[\w\d_-]+\]/g),
  cwd: new RegExp(`${process.cwd()}/?`, 'g'),
  env: new RegExp(/\$\{?[\w\d_]+\}?/g),
}

const COLORIZERS: Colorizer[] = [
  (text: string) => chalk.grey(text),
  (text: string) => text.replace(REGEX.brackets, part => chalk.blue(part)),
  (text: string) => text.replace(REGEX.braces, part => chalk.bold.yellow(part)),
  (text: string) => text.replace(REGEX.cwd, _ => ''),
  (text: string) => text.replace(REGEX.env, part => chalk.cyan(part)),
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
