import { fs } from '@nofrills/fs'

import { ProjectGroup } from '../Projects/ProjectGroup'
import { getProjectLoaders } from './GetProjectLoaders'

export async function getProjectGroup(cwd: string): Promise<ProjectGroup> {
  const loaders = await getProjectLoaders(cwd)
  const projects = await Promise.all(loaders.map(loader => loader.load(cwd)))

  return projects.reduce<ProjectGroup>(
    (group, project) => {
      group.projects.push(project)
      return group
    },
    { name: fs.basename(cwd), projects: [] },
  )
}
