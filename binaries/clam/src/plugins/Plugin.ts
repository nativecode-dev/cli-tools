import { Argv } from 'yargs'

import Logger from '../Logging'

import { Manifest } from './Manifest'
import { fs } from '@nofrills/fs'
import { ManifestCommand } from './ManifestCommand'

export class Plugin {
  private readonly log = Logger.extend('plugin')

  constructor(public readonly cwd: string, private readonly manifest: Manifest) {
    this.log.trace(':constructor', manifest)
  }

  get commands(): string[] {
    return this.manifest.commands.map(command => command.name)
  }

  create(args: Argv<{}>): Promise<Argv<{}>> {
    return this.manifest.commands.reduce(async (yargs, command) => {
      return command.files.reduce(async (inner, file) => {
        return this.createCommand(await inner, file, command)
      }, Promise.resolve(args.command(command.command, command.description)))
    }, Promise.resolve(args))
  }

  private async createCommand(yargs: Argv<{}>, file: string, command: ManifestCommand): Promise<Argv<{}>> {
    const filepath = fs.join(this.cwd, file)
    this.log.trace(':create-command', command.name, filepath)
    return yargs.command(await import(filepath))
  }
}
