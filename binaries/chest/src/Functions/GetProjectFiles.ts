import { fs } from '@nofrills/fs'

import { Project } from '../Projects/Project'

export async function getProjectFiles(
  cwd: string,
  name: string,
  type: string,
  allowed: string[],
  ignored: string[] = [],
): Promise<Project> {
  const found = await fs.glob(`**/*`, cwd)
  const filterAllowed = (path: string) => allowed.some(x => new RegExp(x, 'gim').test(path))
  const filterIgnored = (path: string) => ignored.every(x => new RegExp(x, 'gim').test(path) === false)
  const files = found.filter(filterIgnored).filter(filterAllowed)

  return {
    directory: cwd,
    files: files.map(file => ({
      directory: fs.dirname(file).replace(`${cwd}/`, ''),
      filename: fs.basename(file),
      type: fs.ext(file),
    })),
    name: name,
    type,
  }
}
