import yargs, { Argv } from 'yargs'

import { fs } from '@nofrills/fs'
import { EventEmitter } from 'events'

import Logger from './Logging'

import { ConfigLoader } from './config/ConfigLoader'
import { PluginLoader } from './plugins/PluginLoader'

import { Config } from './config/Config'

const regex = new RegExp(/\$\{?([A-Za-z,0-9,_]+)\}?/g)

export class Clam extends EventEmitter {
  private readonly log = Logger

  private readonly regex = new RegExp(/\$\{?[A-Za-z,0-9,_]+\}?\/?/g)

  constructor(private readonly yargs: Argv<{}>) {
    super()
  }

  async initialize(): Promise<Argv<{}>> {
    const configs = await this.configs()
    const loaders = await this.plugins(configs)
    const manifests = await Promise.all(loaders.map(loader => loader.manifests()))
    const plugins = manifests.reduce((result, current) => result.concat(current), [])
    return plugins.reduce(async (result, plugin) => plugin.create(await result), Promise.resolve(this.yargs))
  }

  protected async configs(): Promise<Config[]> {
    const loader = new ConfigLoader([__dirname, process.cwd()])
    const configs = await loader.configurations()
    return configs
  }

  protected environment(value: string): string {
    const replacement = value.replace(regex, (_, part) => {
      return process.env[part] || ''
    })
    return replacement
  }

  protected async plugins(configs: Config[]): Promise<PluginLoader[]> {
    const directories = [
      __dirname,
      ...configs
        .map(config => config.plugins)
        .reduce((result, current) => result.concat(current), [])
        .map(directory => this.environment(directory))
        .map(directory => fs.resolve(directory)),
    ]

    const dirmap = await Promise.all(
      directories.map(async directory => ({ directory, exists: await fs.exists(directory) })),
    )

    return dirmap.filter(dir => dir.exists).map(dir => new PluginLoader(dir.directory))
  }
}

async function main() {
  const booty = yargs
    .option('config', {
      alias: 'c',
      default: null,
      string: true,
    })
    .option('cwd', {
      default: process.cwd(),
      string: true,
    })
    .help()
    .showHelpOnFail(false)
    .scriptName(fs.basename(__filename, false))

  const clam = new Clam(booty)
  const final = await clam.initialize()
  final.parse()
}

main().catch(console.error)
