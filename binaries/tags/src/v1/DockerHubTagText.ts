import { Tag } from './Tag'
import { TagInfo } from './TagInfo'
import { DockerHubTagSource } from './DockerHubTagSource'
import { DockerHubTagsOptions } from './DockerHubTagsOptions'

export class DockerHubTagText implements DockerHubTagSource {
  constructor(private readonly tags: TagInfo[], private readonly options: DockerHubTagsOptions) {}

  enumerate(): Tag[] {
    return this.tags.map(tag => ({
      name: tag.name,
      value: tag.name,
      version: { original: tag.name, value: tag.name },
    }))
  }

  latest(currentVersion: string, limitVersion?: string): string {
    return currentVersion
  }

  latestVersions(currentVersion: string, limitVersion?: string): string[] {
    return [currentVersion]
  }
}
