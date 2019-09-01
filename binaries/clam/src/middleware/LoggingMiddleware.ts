import { Argv } from 'yargs'

import { ClamOptions } from '../ClamOptions'
import { SetLogLevel } from '../Logging'

export default function LoggingMiddleware(yargs: Argv<ClamOptions>): Argv<ClamOptions> {
  return yargs.middleware(args => SetLogLevel(args.logLevel))
}
