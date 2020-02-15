import { RepositoryResults } from '../Models/Results'
import { RepositoryInfo } from '../Models/RepositoryInfo'
import { DockerHubResource } from '../DockerHubResource'

export class Repository extends DockerHubResource {
  list(username: string, pagesize: number = 100): Promise<RepositoryResults<RepositoryInfo>> {
    return this.http_get<RepositoryResults<RepositoryInfo>>(`repositories/${username}/?page_size=${pagesize}`)
  }
}
