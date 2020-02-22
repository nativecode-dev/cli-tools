import { ProjectFile } from './ProjectFile'

export interface Project {
  directory: string
  files: ProjectFile[]
  name: string
  type: string
}
