import { CommandModule, CommandBuilder } from 'yargs'

import { getProjectGroup } from '../../Functions/GetProjectGroup'

import { ProjectListOptions } from './ProjectListOptions'
import { ChestProjectType } from '../ChestProjectType'
import { output } from '../../Output/Output'

export class ProjectList implements CommandModule<{}, ProjectListOptions> {
  aliases = ['list', 'ls']
  command = 'list [project_name]'

  builder: CommandBuilder<{}, ProjectListOptions> = {
    type: {
      choices: Object.keys(ChestProjectType),
      default: 'detect',
      type: 'string',
    },
  }

  handler = async (args: ProjectListOptions) => {
    const cwd = args.cwd || process.cwd()
    const group = await getProjectGroup(cwd)

    args.filtered_projects = group.projects.filter(project => {
      const filteredByName = args.project_name === project.name
      const filteredByType = args.type === project.type
      const hasProjectName = args.project_name === undefined
      return hasProjectName || filteredByName || filteredByType ? true : false
    })

    return output(args.filtered_projects, args.format)
  }
}

export const ProjectListCommand = new ProjectList()
