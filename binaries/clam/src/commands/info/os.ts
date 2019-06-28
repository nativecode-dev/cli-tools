import { Arguments, CommandModule } from 'yargs'

export interface OsOptions {}

class OsCommand implements CommandModule<{}, OsOptions> {
  readonly aliases = []
  readonly builder = {}
  readonly command = 'os'
  readonly describe = 'shows operating system information'

  handler = (args: Arguments<OsOptions>): void => {
    console.log(':os', args)
  }
}

export default new OsCommand()
