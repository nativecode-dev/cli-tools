import { Npm } from '../../Interfaces/Npm/Npm'
import { ProjectLoader } from '../ProjectLoader'

export class NpmLoader extends ProjectLoader {
  get configuration(): string {
    return 'package.json'
  }

  get allowed(): string[] {
    return ['.js$']
  }

  get ignored(): string[] {
    return ['node_modules']
  }

  async projectName(): Promise<string> {
    const config = await this.config<Npm>()
    return config.name
  }
}

export const DefaultNpmLoader = new NpmLoader()
