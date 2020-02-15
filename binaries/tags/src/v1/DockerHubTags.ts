import fetch from 'node-fetch'
import merge from 'deepmerge'

import { DockerHubTagText } from './DockerHubTagText'
import { DockerHubTagVersion } from './DockerHubTagVersion'
import { DockerHubTagSource } from './DockerHubTagSource'
import { DockerHubTagType } from './DockerHubTagType'
import { DefaultDockerHubTagsOptions, DockerHubTagsOptions } from './DockerHubTagsOptions'

export class DockerHubTags {
  private readonly options: DockerHubTagsOptions

  constructor(options: Partial<DockerHubTagsOptions>) {
    this.options = merge.all<DockerHubTagsOptions>([DefaultDockerHubTagsOptions, options])
  }

  async tags(): Promise<DockerHubTagSource> {
    const response = await fetch(`https://registry.hub.docker.com/v1/repositories/${this.options.repository}/tags`)

    if (response.ok) {
      const tags = await response.json()

      switch (this.options.type) {
        case DockerHubTagType.semver:
          return new DockerHubTagVersion(tags, this.options)

        default:
          return new DockerHubTagText(tags, this.options)
      }
    }

    throw new Error(response.statusText)
  }
}
