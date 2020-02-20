import path from 'path'

export class WorkspaceLoader {
  protected readonly directory: string
  protected readonly name: string

  constructor(protected readonly cwd: string) {
    this.directory = path.dirname(cwd)
    this.name = path.basename(cwd)
  }
}
