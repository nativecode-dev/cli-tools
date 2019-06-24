import { Loader } from '../Loader'
import { Config } from './Config'

export class ConfigLoader extends Loader<Config> {
  constructor(filepaths: string[]) {
    super('clam-config.json', filepaths)
  }

  async configurations(): Promise<Config[]> {
    const configs = await super.load()
    return configs.map(config => config.json)
  }
}
