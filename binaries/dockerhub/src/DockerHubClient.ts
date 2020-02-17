import { URL } from 'url'
import { compare, validate } from 'compare-versions'
import { CreateLogger, CreateOptions } from '@nofrills/lincoln-debug'

import { Tag } from './Tag'
import { TagMatch } from './TagMatch'
import { TagVersionParse } from './TagVersionParse'

import { Tags } from './Resources/Tags'
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

  match(matcher: TagMatch): DockerHubClient {
    this.matchers.add(matcher)
    return this
  }

  async find(repository: string, reverse: boolean = false): Promise<Tag[]> {
    const matchers = Array.from(this.matchers.values())
    const source = await this.tags.list(repository)

    this.matchers.clear()

    const operator = () => (reverse ? '<' : '>')

    const matched = matchers
      .reduce<Tag[]>(
        (tags, matcher) => this.tag_match(matcher, this.tag_resolve(tags)),
        source.results.map(tag => ({ repository: tag, version: TagVersionParse(tag.name) })),
      )
      .sort((source, target) => {
        const src = source.version && validate(source.version.original) ? source : null
        const tgt = target.version && validate(target.version.original) ? target : null

        if (src && tgt) {
          return compare(src.version!.original, tgt.version!.original, operator()) ? 1 : -1
        }

        return source.repository.name > target.repository.name ? 1 : -1
      })

    return Promise.resolve(matched)
  }

  async latest(repository: string): Promise<Tag | null> {
    const found = await this.find(repository)

    return found.reduce<Tag | null>(
      (tag, current) => (tag && compare(current.repository.name, tag.repository.name, '<') ? tag : current),
      null,
    )
  }

  private tag_match(matcher: TagMatch, tags: Tag[]): Tag[] {
    return tags.reduce<Tag[]>((results, tag) => {
      const matches = matcher(tag)

      if (matches) {
        results.push(tag)
      }

      return results
    }, [])
  }

  private tag_resolve(tags: Tag[]): Tag[] {
    return tags.map(tag => {
      if (/[a-zA-Z]+/g.test(tag.repository.name)) {
        const matched = tags.find(x => tag.repository.full_size === x.repository.full_size)

        if (matched) {
          tag.version = matched.version
        }
      }

      return tag
    })
  }
}
