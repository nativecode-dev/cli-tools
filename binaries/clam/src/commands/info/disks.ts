import { Arguments, CommandModule } from 'yargs'

export interface DiskOptions {}

class DisksCommand implements CommandModule<{}, DiskOptions> {
  readonly aliases = []
  readonly builder = {}
  readonly command = 'disks'
  readonly describe = 'shows device information'

  handler = (args: Arguments<DiskOptions>): void => {
    console.log(':disks', args)
  }
}

export default new DisksCommand()
