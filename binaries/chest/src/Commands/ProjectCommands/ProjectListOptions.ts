import { Project } from '../../Projects/Project'
import { ChestProjectOptions } from '../ChestProjectOptions'

export interface ProjectListOptions extends ChestProjectOptions {
  filtered_projects: Project[]
  project_name: string
  type: string
}
