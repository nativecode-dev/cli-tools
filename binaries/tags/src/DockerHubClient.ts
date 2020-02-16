import { URL } from 'url'
import { CreateLogger, CreateOptions } from '@nofrills/lincoln-debug'

import { RepositoryTag } from './Models/RepositoryTag'
import { Tags } from './Resources/Tags'
import { TagMatch } from './TagMatch'
import { Namespaces } from './Resources/Namespaces'
import { Repositories } from './Resources/Repositories'
import { Authentication } from './Resources/Authentication'

const options = CreateOptions('dockerhub')
const logger = CreateLogger(options)

export class DockerHubClient {
  private readonly matchers: Set<TagMatch> = new Set<TagMatch>()

  auth: Authentication
  namespaces: Namespaces
  repositories: Repositories
  tags: Tags

  constructor(token?: string, version: number = 2) {
    const endpoint = new URL(`https://hub.docker.com/v${version}`)

    this.auth = new Authentication(endpoint, logger, token => {
      const authtoken = `JWT ${token}`
      this.namespaces.setAuthorization(authtoken)
      this.repositories.setAuthorization(authtoken)
      this.tags.setAuthorization(authtoken)
    })

    this.namespaces = new Namespaces(endpoint, logger)
    this.repositories = new Repositories(endpoint, logger)
    this.tags = new Tags(endpoint, logger)

    if (token) {
      this.auth.setToken(token)
    }
  }

  filter(filter: TagMatch): DockerHubClient {
    this.matchers.add(filter)
    return this
  }

  async find(username: string, repository: string): Promise<RepositoryTag[]> {
    const matchers = Array.from(this.matchers.values())
    const tags = await this.tags.list(username, repository)

    this.matchers.clear()

    return Promise.resolve(
      tags.results.reduce<RepositoryTag[]>((results, tag) => {
        const matches = matchers.reduce((result, current) => {
          if (current(tag) === false) {
            return false
          }

          return result
        }, true)

        if (matches) {
          results.push(tag)
        }

        return results
      }, []),
    )
  }
}
