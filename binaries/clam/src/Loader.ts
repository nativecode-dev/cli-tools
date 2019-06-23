import { CreateResolver, FileResolver, fs } from '@nofrills/fs'

export interface LoaderMap<T> {
  cwd: string
  json: T
}

export abstract class Loader<T> {
  protected readonly resolvers: FileResolver[]

  constructor(private readonly loadfile: string, private readonly filepaths: string[]) {
    this.resolvers = this.filepaths.map(filepath => CreateResolver(filepath))
  }

  protected async load(): Promise<LoaderMap<T>[]> {
    const resolved = await Promise.all(this.resolvers.map(resolver => resolver.find(this.loadfile)))
    const filenames = resolved.reduce((files, current) => files.concat(current), [])

    return Promise.all(
      filenames.map(async filename => {
        const cwd = fs.dirname(filename)
        const json = await fs.json<T>(filename)
        return { cwd, json }
      }),
    )
  }
}
