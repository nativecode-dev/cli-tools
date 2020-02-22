import { ResourceParamType } from '@nativecode/rest-client'

import { DockerHubResults } from '../Models/DockerHubResults'
import { RepositoryInfo } from '../Models/RepositoryInfo'
import { DockerHubResource } from '../DockerHubResource'

export class Repositories extends DockerHubResource {
  list(username: string, size: number = 500): Promise<DockerHubResults<RepositoryInfo>> {
    return this.http_get<DockerHubResults<RepositoryInfo>>(`repositories/${username}/`, {
      key: 'page_size',
      type: ResourceParamType.Query,
      value: size,
    })
  }
}
