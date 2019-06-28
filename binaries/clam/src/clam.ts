import { Argv } from 'yargs'

import { fs } from '@nofrills/fs'
import { EventEmitter } from 'events'

import Logger from './Logging'

import { ConfigLoader } from './config/ConfigLoader'
import { PluginLoader } from './plugins/PluginLoader'

import cli from './cli'
import { Config } from './config/Config'

const regex = new RegExp(/\$\{?([A-Za-z,0-9,_]+)\}?/g)

export class Clam extends EventEmitter {
  private readonly log = Logger

  private readonly regex = new RegExp(/\$\{?[A-Za-z,0-9,_]+\}?\/?/g)

  async initialize(yargs: Argv<{}>): Promise<Argv<{}>> {
    const configs = await this.configs()
    const loaders = await this.plugins(configs)
    const manifests = await Promise.all(loaders.map(loader => loader.manifests()))
    const plugins = manifests.reduce((result, current) => result.concat(current), [])
    return plugins.reduce(async (result, plugin) => plugin.create(await result), Promise.resolve(yargs))
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
        .map(config => config.locations.plugins)
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
  const clam = new Clam()
  const host = await clam.initialize(cli())
  return host.parse()
}

main().catch(console.error)
