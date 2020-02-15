import { URL } from 'url'
import { CreateLogger, CreateOptions } from '@nofrills/lincoln-debug'

import { Tag } from './Models/Tag'
import { TagFilter } from './TagFilter'
import { Namespace } from './Resources/Namespace'
import { Repository } from './Resources/Repository'
import { RepositoryTag } from './Resources/RepositoryTag'
import { Authentication } from './Resources/Authentication'

const options = CreateOptions('dockerhub')
const logger = CreateLogger(options)

export class DockerHubClient {
  private readonly filters: Set<TagFilter> = new Set<TagFilter>()

  auth: Authentication
  namespace: Namespace
  repository: Repository
  tag: RepositoryTag

  constructor(version: number = 2) {
    const endpoint = new URL(`https://hub.docker.com/v${version}`)

    this.auth = new Authentication(endpoint, logger, token => {
      const authstr = `JWT ${token}`
      this.namespace.setAuthorization(authstr)
      this.repository.setAuthorization(authstr)
      this.tag.setAuthorization(authstr)
    })

    this.namespace = new Namespace(endpoint, logger)
    this.repository = new Repository(endpoint, logger)
    this.tag = new RepositoryTag(endpoint, logger)
  }

  filter(filter: TagFilter): DockerHubClient {
    this.filters.add(filter)
    return this
  }

  async find(username: string, repository: string): Promise<Tag[]> {
    const found = await this.tag.list(username, repository)
    const filters = Array.from(this.filters.values())
    this.filters.clear()

    return Promise.resolve(
      filters.reduce<Tag[]>((results, current) => results.concat(found.results.filter(current)), []),
    )
  }

  semver(version: string): boolean {
    const pattern = /^(?:([a-zA-Z0-9]+)-)?v?((?:[0-9]+\.){2,3}[0-9]+)(?:-([\w\d]+))?$/m
    return pattern.test(version)
  }

  text(version: string): boolean {
    const pattern = /[\d_-]+/m
    return pattern.test(version)
  }
}
