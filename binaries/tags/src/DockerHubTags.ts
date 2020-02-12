import fetch from 'node-fetch'

import { DockerTagSearch } from './DockerHubTagSearch'

export class DockerTags {
  constructor(protected readonly repository: string) {}

  async tags(): Promise<DockerTagSearch> {
    const response = await fetch(`https://registry.hub.docker.com/v1/repositories/${this.repository}/tags`)

    if (response.ok) {
      const tags = await response.json()
      return new DockerTagSearch(tags)
    }

    throw new Error(response.statusText)
  }
}
