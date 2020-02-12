import { Tag } from './Tag'
import { TagInfo } from './TagInfo'
import { DockerHubTagSource } from './DockerHubTagSource'

export class DockerHubTagText implements DockerHubTagSource {
  constructor(private readonly tags: TagInfo[]) {}

  enumerate(): Tag[] {
    return this.tags
      .map(tag => tag.name)
      .reduce<Tag[]>((result, current) => {
        return [...result, { name: current, value: current }]
      }, [])
  }

  latest(currentVersion: string, limitVersion?: string): string {
    return currentVersion
  }
}
