import { Namespace } from '../Models/Namespace'
import { DockerHubResource } from '../DockerHubResource'

export class Namespaces extends DockerHubResource {
  async list(): Promise<string[]> {
    const response = await this.http_get<Namespace>('repositories/namespaces/')
    return response.namespaces
  }
}
