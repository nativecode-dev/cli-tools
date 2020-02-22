import { fs } from '@nofrills/fs'

import { Project } from './Project'
import { getProjectFiles } from '../Functions/GetProjectFiles'

export abstract class ProjectLoader {
  abstract get configuration(): string
  abstract get allowed(): string[]
  abstract get ignored(): string[]

  abstract projectName(): Promise<string>

  async config<T>(): Promise<T> {
    if ((await fs.exists(this.configuration)) === false) {
      throw new Error(`could not find configuration: ${this.configuration}`)
    }

    return fs.json<T>(this.configuration)
  }

  async load(cwd: string): Promise<Project> {
    const name = await this.projectName()
    return getProjectFiles(cwd, name, fs.basename(this.configuration, false), this.allowed, this.ignored)
  }
}
