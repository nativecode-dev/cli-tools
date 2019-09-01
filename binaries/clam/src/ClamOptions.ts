import { Argv } from 'yargs'
import { LogMessageType } from '@nofrills/lincoln'

export interface ClamOptions {
  cwd: string
  logLevel: LogMessageType
}

export default function ClamOptions(yargs: Argv<ClamOptions>): Argv<ClamOptions> {
  return yargs
    .option('cwd', {
      describe: 'Set the current directory',
      default: process.cwd(),
    })
    .option('log-level', {
      choices: [
        LogMessageType.debug,
        LogMessageType.error,
        LogMessageType.fatal,
        LogMessageType.info,
        LogMessageType.silly,
        LogMessageType.trace,
        LogMessageType.warn,
      ],
      describe: 'Set the logging level',
      default: LogMessageType.warn,
    })
}
