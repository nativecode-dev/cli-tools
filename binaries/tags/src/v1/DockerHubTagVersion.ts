import { compare } from 'compare-versions'

import { Tag } from './Tag'
import { TagInfo } from './TagInfo'
import { DockerHubTagSource } from './DockerHubTagSource'
import { DockerHubTagsOptions } from './DockerHubTagsOptions'

export class DockerHubTagVersion implements DockerHubTagSource {
  constructor(private readonly tags: TagInfo[], private readonly options: DockerHubTagsOptions) {}

  enumerate(): Tag[] {
    return this.tags
      .map(this.map)
      .reduce<Tag[]>((results, current) => {
        if (current === null) {
          return results
        }

        return [...results, current]
      }, [])
      .filter(tag => {
        if (tag.version.arch) {
          return false
        }

        const tagStartsWith =
          this.options.tagStartsWith.length > 0
            ? this.options.tagStartsWith.some(startsWith => tag.version.original.startsWith(startsWith))
            : true

        if (tagStartsWith === false) {
          return false
        }

        return true
      })
      .sort((a, b) => (compare(a.name, b.name, '>') ? 1 : -1))
  }

  latest(currentVersion: string, limitVersion?: string): string {
    return this.enumerate().reduce((result, current) => {
      if (compare(current.version.original, currentVersion, '>')) {
        if (limitVersion && compare(current.version.original, limitVersion, '>')) {
          return result
        }

        return current.version.original
      }

      return result
    }, currentVersion)
  }

  latestVersions(currentVersion: string, limitVersion?: string): string[] {
    return this.enumerate().reduce<string[]>((result, current) => {
      if (compare(current.version.original, currentVersion, '>')) {
        if (limitVersion && compare(current.version.original, limitVersion, '>')) {
          return result
        }

        return [...result, current.version.original]
      }

      return result
    }, [])
  }

  private map(tag: TagInfo): Tag | null {
    const pattern = /^(?:([a-zA-Z0-9]+)-)?v?((?:[0-9]+\.){2,3}[0-9]+)(?:-([\w\d]+))?$/m
    const matches = pattern.exec(tag.name)

    if (matches) {
      return {
        name: tag.name,
        value: tag.name,
        version: {
          original: matches[0],
          arch: matches[1],
          prerelease: matches[3],
          value: matches[2],
        },
      }
    }

    return null
  }
}
