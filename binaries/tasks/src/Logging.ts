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
  debug: new RegExp(/^\[#[\w\d_\-\:>]+\]/g),
  env: new RegExp(/\$\{?[\w\d_]+\}?/g),
  error: new RegExp(/^\[\![\w\d_\-\:]+\]/g),
  info: new RegExp(/^\[\:[\w\d_\-\:]+\]/g),
  taskexec: new RegExp(/^\[[\w\d_\-\:]+\]/g),
  timing: new RegExp(/^\[@[^\]]+\]/g),
}

const COLORIZERS: Colorizer[] = [
  (text: string) => text.replace(REGEX.info, part => chalk.bold.yellow(part)),
  (text: string) => text.replace(REGEX.cwd, _ => ''),
  (text: string) => text.replace(REGEX.debug, part => chalk.bold.yellow(part)),
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

function write(stream: NodeJS.WriteStream, log: Log): void {
  stream.write(colorize(log.parameters))

  if (log.parameters.length) {
    stream.write('\n')
  }
}

LoggerOptions.interceptors.register('colorize', async (log: Log) => {
  switch (log.type) {
    case LogMessageType.debug:
    case LogMessageType.error:
      if (GLOBAL.arguments.debug) {
        if (log.parameters.length) {
          const category = log.parameters.slice(1, 1).map(value => `[#${value}]`)
          const values = log.parameters
            .slice(1)
            .map(value => (Is.object(value) ? JSON.stringify(value, null, 2) : value))
          const relog = { ...log, ...{ parameters: [category, ...values] } }
          write(process.stderr, relog)
        } else {
          write(process.stderr, log)
        }
      }
      break

    case LogMessageType.silly:
    case LogMessageType.trace:
      write(process.stdout, log)
      break
  }

  return Promise.resolve(log)
})

LoggerOptions.interceptors.register('scrubs', ScrubsInterceptor)

const Logger: Lincoln = CreateLogger(LoggerOptions)

export default Logger
