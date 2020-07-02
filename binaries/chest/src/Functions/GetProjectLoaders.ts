import { fs } from '@nofrills/fs'

import { ProjectLoader } from '../Projects/ProjectLoader'
import { ProjectLoaders } from '../Projects/ProjectLoaders'

export async function getProjectLoaders(cwd: string): Promise<ProjectLoader[]> {
  const loaders = await Promise.all(
    ProjectLoaders.map(async (loader) => {
      const filename = fs.join(cwd, loader.configuration)

      if (await fs.exists(filename)) {
        return loader
      }

      return null
    }),
  )

  return loaders.reduce<ProjectLoader[]>((results, loader) => {
    if (loader !== null) {
      return [...results, loader]
    }

    return results
  }, [])
}
