import { DockerHubResource } from '../DockerHubResource'

export interface RepositoryNamespace {
  namespaces: string[]
}

export class Namespace extends DockerHubResource {
  async list(): Promise<string[]> {
    const response = await this.http_get<RepositoryNamespace>('repositories/namespaces/')
    return response.namespaces
  }
}
