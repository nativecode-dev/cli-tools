import yargs, { CommandModule } from 'yargs'

import Logger from '../../Logging'
import GLOBAL from '../Globals'

import { Options } from '../Options'
import { fs } from '@nofrills/fs'

const log = Logger.extend('view')

const validfiles = ['package.json', 'tasks.json']

export interface ViewOptions extends Options {
  filename: string
}

const command: CommandModule<{}, ViewOptions> = {
  aliases: [':config'],
  builder: {},
  command: ':view [filename]',
  describe: 'view a configuration file',
  handler: async args => {
    if (args.filename) {
      const name = fs.basename(args.filename)

      if (validfiles.includes(name) === false) {
        await Promise.resolve(yargs.showHelp())
        return args
      }

      const exists = await fs.exists(args.filename)

      if (exists) {
        const buffer = await fs.readFile(args.filename)
        log.silly(buffer.toString())
      }

      return args
    }

    log.trace(GLOBAL.format(GLOBAL.config, args.formatted))
    return args
  },
}

export default command
