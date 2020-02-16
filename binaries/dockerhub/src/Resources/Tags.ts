import { RepositoryTag } from '../Models/RepositoryTag'
import { DockerHubResults } from '../Models/DockerHubResults'
import { DockerHubResource } from '../DockerHubResource'
import { ResourceParamType } from '@nativecode/rest-client'

export class Tags extends DockerHubResource {
  list(username: string, repository: string, size: number = 1000): Promise<DockerHubResults<RepositoryTag>> {
    return this.http_get<DockerHubResults<RepositoryTag>>(`repositories/${username}/${repository}/tags/`, {
      key: 'page_size',
      type: ResourceParamType.Query,
      value: size,
    })
  }
}
