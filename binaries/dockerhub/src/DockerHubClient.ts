import { URL } from 'url'
import { compare, validate } from 'compare-versions'
import { CreateLogger, CreateOptions } from '@nofrills/lincoln-debug'

import { Tag } from './Tag'
import { TagMap } from './TagMap'
import { TagSort } from './TagSort'
import { TagMatch } from './TagMatch'
import { TagMatcher } from './TagMatcher'
import { TagResolveAll } from './TagResolveAll'

import { Tags } from './Resources/Tags'
import { Namespaces } from './Resources/Namespaces'
import { Repositories } from './Resources/Repositories'
import { Authentication } from './Resources/Authentication'

const options = CreateOptions('dockerhub')
const logger = CreateLogger(options)

export class DockerHubClient {
  private readonly matchers: Set<TagMatcher> = new Set<TagMatcher>()

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

  match(matcher: TagMatcher): DockerHubClient {
    this.matchers.add(matcher)
    return this
  }

  async find(repository: string, reverse: boolean = false): Promise<Tag[]> {
    const matchers = Array.from(this.matchers.values())
    const source = await this.tags.list(repository)

    this.matchers.clear()

    return Promise.resolve(
      matchers
        .reduce<Tag[]>((tags, matcher) => TagMatch(tags, matcher), TagResolveAll(TagMap(source.results)))
        .filter(tag => tag.version)
        .sort(TagSort(reverse)),
    )
  }

  async latest(repository: string): Promise<Tag | null> {
    const tags = await this.find(repository)

    const latest = (source: Tag, target: Tag | null) => {
      if (source.repotag.name === 'latest') {
        return true
      }

      return target
        ? validate(source.repotag.name) &&
            validate(target.repotag.name) &&
            compare(source.repotag.name, target.repotag.name, '>')
        : true
    }

    return tags.reduce<Tag | null>((result, tag) => (latest(tag, result) ? tag : result), null)
  }
}
