import { Arguments, CommandModule } from 'yargs'

export interface DiskOptions {}

class DisksCommand implements CommandModule<{}, DiskOptions> {
  readonly aliases = []
  readonly builder = {}
  readonly command = 'os'
  readonly describe = 'shows operating system information'

  handler = (args: Arguments<DiskOptions>): void => {
    return
  }
}

export default new DisksCommand()
