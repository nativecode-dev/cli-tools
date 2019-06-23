import { ManifestCommand } from './ManifestCommand'

export interface Manifest {
  cwd: string
  commands: ManifestCommand[]
}
