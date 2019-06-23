import { Arguments, CommandModule } from 'yargs'

export interface CpuOptions {}

class CpuCommand implements CommandModule<{}, CpuOptions> {
  readonly aliases = []
  readonly builder = {}
  readonly command = 'os'
  readonly describe = 'shows operating system information'

  handler = (args: Arguments<CpuOptions>): void => {
    return
  }
}

export default new CpuCommand()
