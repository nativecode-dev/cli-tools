import { Argv } from 'yargs'

import Logger from '../Logging'

import { Manifest } from './Manifest'
import { fs } from '@nofrills/fs'

export class Plugin {
  private readonly log = Logger.extend('plugin')

  constructor(public readonly cwd: string, private readonly manifest: Manifest) {
    this.log.trace(':constructor', manifest)
  }

  create(args: Argv<{}>): Promise<Argv<{}>> {
    return this.manifest.files.reduce(async (inner, filename) => {
      const yargs = await inner
      return this.createCommand(yargs, filename)
    }, Promise.resolve(args))
  }

  private async createCommand(yargs: Argv<{}>, filename: string): Promise<Argv<{}>> {
    const filepath = fs.join(this.cwd, filename)
    const command = (await require(filepath)).default
    const path = fs.relative(process.cwd(), filepath)
    this.log.trace(':create-command', this.manifest.name, path, command)
    return yargs.command(command)
  }
}
