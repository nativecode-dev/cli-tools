import { RepositoryTag } from '../Models/RepositoryTag'
import { DockerHubResults } from '../Models/DockerHubResults'
import { DockerHubResource } from '../DockerHubResource'
import { ResourceParamType } from '@nativecode/rest-client'

export class Tags extends DockerHubResource {
  list(repository: string, size: number = 1000): Promise<DockerHubResults<RepositoryTag>> {
    const repo = repository.indexOf('/') > 0 ? repository : `library/${repository}`

    return this.http_get<DockerHubResults<RepositoryTag>>(`repositories/${repo}/tags/`, {
      key: 'page_size',
      type: ResourceParamType.Query,
      value: size,
    })
  }
}
