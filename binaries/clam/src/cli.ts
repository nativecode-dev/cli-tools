import yargs, { Argv } from 'yargs'

import { fs } from '@nofrills/fs'

export default function cli(): Argv<{}> {
  return yargs
    .option('config', {
      alias: 'c',
      default: null,
      string: true,
    })
    .option('cwd', {
      default: process.cwd(),
      string: true,
    })
    .help()
    .showHelpOnFail(false)
    .scriptName(fs.basename(__filename, false))
}
