import { fs } from '@nofrills/fs'

import { ProjectLoader } from '../ProjectLoader'

export class TypeScriptLoader extends ProjectLoader {
  get configuration(): string {
    return 'tsconfig.json'
  }

  get allowed(): string[] {
    return ['(^\\.|[^d])\\.ts$']
  }

  get ignored(): string[] {
    return ['node_modules']
  }

  async projectName(): Promise<string> {
    return fs.basename(this.configuration, false)
  }
}

export const DefaultTypeScriptLoader = new TypeScriptLoader()
