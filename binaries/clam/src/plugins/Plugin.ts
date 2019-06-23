import { Argv } from 'yargs'
import { Manifest } from '../models/Manifest'

export class Plugin {
  constructor(private readonly manifest: Manifest) {}

  get commands(): string[] {
    return this.manifest.commands.map(command => command.name)
  }

  get cwd(): string {
    return this.manifest.cwd
  }

  create(args: Argv<{}>): Argv<{}> {
    return this.manifest.commands.reduce((yargs, command) => {
      return command.files.reduce((_, file) => _.command(require(file)), yargs)
    }, args)
  }
}
