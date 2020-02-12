import { Tag } from './Tag'

export interface DockerHubTagSource {
  enumerate(): Tag[]
  latest(currentVersion: string, limitVersion?: string): string
}
