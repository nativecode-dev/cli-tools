import { Arguments, CommandModule } from 'yargs'

export interface CpuOptions {}

class CpuCommand implements CommandModule<{}, CpuOptions> {
  readonly aliases = []
  readonly builder = {}
  readonly command = 'cpu'
  readonly describe = 'shows processor information'

  handler = (args: Arguments<CpuOptions>): void => {
    console.log(':cpu', args)
  }
}

export default new CpuCommand()
