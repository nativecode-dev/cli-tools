import { Tag } from '../Models/Tag'
import { RepositoryResults } from '../Models/Results'
import { DockerHubResource } from '../DockerHubResource'

export class RepositoryTag extends DockerHubResource {
  list(username: string, repository: string, pagesize: number = 10000): Promise<RepositoryResults<Tag>> {
    return this.http_get<RepositoryResults<Tag>>(`repositories/${username}/${repository}/tags/?page_size=${pagesize}`)
  }
}
