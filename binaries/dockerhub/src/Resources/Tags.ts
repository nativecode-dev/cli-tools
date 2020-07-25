import { ResourceParamType } from '@nativecode/rest-client'

import { RepositoryTag } from '../Models/RepositoryTag'
import { DockerHubResults } from '../Models/DockerHubResults'
import { DockerHubResource } from '../DockerHubResource'

export class Tags extends DockerHubResource {
  async list(repository: string, size: number = 100): Promise<DockerHubResults<RepositoryTag>> {
    const repo = repository.indexOf('/') > 0 ? repository : `library/${repository}`

    const blah = await this.response(`repositories/${repo}/tags/`, 'GET', [
      {
        key: 'page_size',
        type: ResourceParamType.Query,
        value: size,
      },
    ])

    return this.http_get<DockerHubResults<RepositoryTag>>(`repositories/${repo}/tags/`, {
      key: 'page_size',
      type: ResourceParamType.Query,
      value: size,
    })
  }
}
