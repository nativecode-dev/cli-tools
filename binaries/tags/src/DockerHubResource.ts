import { RestResource } from '@nativecode/rest-client'

export abstract class DockerHubResource extends RestResource {
  setAuthorization(authorization: string): void {
    this.setHeader('Authorization', authorization)
  }
}
