import chalk from 'chalk'
export { Lincoln } from '@nofrills/lincoln-debug'
import { ScrubsInterceptor } from '@nofrills/scrubs'
import { CreateLogger, CreateOptions, Lincoln, Log, Options } from '@nofrills/lincoln-debug'

const LoggerOptions: Options = CreateOptions('nofrills:tasks')
LoggerOptions.interceptors.register('scrubs', ScrubsInterceptor)
export const Logger: Lincoln = CreateLogger(LoggerOptions)

function colorize(log: Log): string[] {
  switch (log.type) {
    case 'debug':
      return [
        chalk.dim.yellow('d|'),
        chalk.bold.gray(...log.parameters.slice(0, 1)),
        chalk.dim.gray(...log.parameters.slice(1)),
      ]
    case 'error':
      return [
        chalk.bold.red('e|'),
        chalk.red(...log.parameters.slice(0, 1)),
        chalk.bgRed.white(...log.parameters.slice(1)),
      ]
    case 'fatal':
      return [
        chalk.bold.red('f|'),
        chalk.red(...log.parameters.slice(0, 1)),
        chalk.bgRed.white(...log.parameters.slice(1)),
      ]
    case 'info':
      return [
        chalk.bold.blue('i|'),
        chalk.dim.green(...log.parameters.slice(0, 1)),
        chalk.dim.white(...log.parameters.slice(1)),
      ]
    case 'silly':
      return [
        chalk.bold.blue('s|'),
        chalk.dim.blue(...log.parameters.slice(0, 1)),
        chalk.dim.white(...log.parameters.slice(1)),
      ]
    case 'trace':
      return [chalk.bold.gray('s|'), chalk.bold.gray(...log.parameters)]
    case 'warn':
      return [chalk.bold.yellow('w|'), chalk.bold.yellow(...log.parameters)]
    default:
      return [chalk.bold.blue(''), chalk.bold.white(...log.parameters)]
  }
}

const namespace = ''
const ConsoleLogOptions: Options = CreateOptions(
  namespace,
  [['task-filter', (log: Log) => Promise.resolve(log.namespace === namespace)]],
  [
    [
      'console-log',
      (log: Log) => {
        console.log(...colorize(log))
        return Promise.resolve(log)
      },
    ],
  ],
)
ConsoleLogOptions.emitTag = false
export const ConsoleLog: Lincoln = CreateLogger(ConsoleLogOptions)
