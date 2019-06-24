import { Loader } from '../Loader'
import { Plugin } from './Plugin'

import { Manifest } from './Manifest'

export class PluginLoader extends Loader<Manifest> {
  constructor(filepath: string) {
    super('clam-plugins.json', [filepath])
  }

  async manifests(): Promise<Plugin[]> {
    const manifests = await super.load()

    return manifests.map(manifest => {
      return new Plugin(manifest.cwd, manifest.json)
    })
  }
}
