import { fs } from '@nofrills/fs'

import { Config } from './Config'

const DefaultConfig: Config = {
  username: process.env.DOCKERHUB_USERNAME || 'username',
}

export class ConfigFile {
  static readonly filename = `${process.env.HOME}/.config/.dockerhub.json`

  static async load(filename: string): Promise<Config> {
    if (await fs.exists(filename)) {
      return fs.json<Config>(filename)
    }

    return DefaultConfig
  }

  static async save(filename: string, config: Config): Promise<Config> {
    if (await fs.exists(filename)) {
      const current = await fs.json<Config>(filename)
      return { ...DefaultConfig, ...config, ...current }
    }

    await fs.save(filename, config)

    return config
  }
}
