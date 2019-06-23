import yargs, { Argv } from 'yargs'

import { fs } from '@nofrills/fs'
import { EventEmitter } from 'events'

import { ConfigLoader } from './ConfigLoader'
import { PluginLoader } from './plugins/PluginLoader'

import { Config } from './models/Config'

const regex = new RegExp(/\$\{?([A-Za-z,0-9,_]+)\}?/g)

export class Clam extends EventEmitter {
  private readonly regex = new RegExp(/\$\{?[A-Za-z,0-9,_]+\}?\/?/g)

  constructor(private readonly booty: yargs.Argv<{}>) {
    super()
  }

  initialize(): Promise<void> {
    return Promise.resolve()
  }

  async load(): Promise<Argv<{}>> {
    const configs = await this.configs()
    const loaders = await this.plugins(configs)
    const manifests = await Promise.all(loaders.map(loader => loader.manifests()))
    const plugins = manifests.reduce((result, current) => result.concat(current), [])
    return plugins.reduce((result, plugin) => plugin.create(result), this.booty)
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
  const clam = new Clam(yargs)
  const booty = await clam.load()

  console.log(booty.help().argv)
}

main().catch(console.error)
