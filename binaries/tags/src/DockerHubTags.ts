import fetch from 'node-fetch'

import { DockerHubTagSearch } from './DockerHubTagSearch'

export class DockerHubTags {
  constructor(protected readonly repository: string) {}

  async tags(): Promise<DockerHubTagSearch> {
    const response = await fetch(`https://registry.hub.docker.com/v1/repositories/${this.repository}/tags`)

    if (response.ok) {
      const tags = await response.json()
      return new DockerHubTagSearch(tags)
    }

    throw new Error(response.statusText)
  }
}
