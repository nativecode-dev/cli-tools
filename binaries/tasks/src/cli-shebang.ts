import { CreateResolver } from '@nofrills/fs'
import { CLI, ConsoleOptions, ProcessArgs } from '@nofrills/console'

import { Shebang } from './tasks/Shebang'
import Logger from './Logging'

const args = ProcessArgs.from(process.argv)

const options: ConsoleOptions = {
  initializer: async () => {
    try {
      const cwd = process.cwd()
      const resolver = CreateResolver(cwd)
      const resolved = await resolver.find('package.json')

      Logger.debug('shebang', cwd)

      await Promise.all(
        resolved.map(async filename => {
          const shebang = Shebang.from(filename)
          await shebang.shebang()
        }),
      )
    } catch (error) {
      Logger.error(error)
    }
  },
}

CLI.run(options, args).catch(Logger.error)
