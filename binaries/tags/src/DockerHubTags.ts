import fetch from 'node-fetch'

import { DockerHubTagText } from './DockerHubTagText'
import { DockerHubTagVersion } from './DockerHubTagVersion'
import { DockerHubTagSource } from './DockerHubTagSource'

export enum DockerHubTagType {
  semver = 'semver',
  text = 'text',
}

export class DockerHubTags {
  constructor(protected readonly repository: string, protected readonly type: DockerHubTagType) {}

  async tags(): Promise<DockerHubTagSource> {
    const response = await fetch(`https://registry.hub.docker.com/v1/repositories/${this.repository}/tags`)

    if (response.ok) {
      const tags = await response.json()
      switch (this.type) {
        case DockerHubTagType.semver: {
          return new DockerHubTagVersion(tags)
        }

        default: {
          return new DockerHubTagText(tags)
        }
      }
    }

    throw new Error(response.statusText)
  }
}
