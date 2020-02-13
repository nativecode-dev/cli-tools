import { compare } from 'compare-versions'

import { Tag } from './Tag'
import { TagInfo } from './TagInfo'
import { TagVersion } from './TagVersion'
import { DockerHubTagSource } from './DockerHubTagSource'

const PATTERN_VERSION = /^(?:([a-zA-Z0-9]+)-)?v?((?:[0-9]+\.){2,3}[0-9]+)(?:-([\w\d]+))?$/m

export class DockerHubTagVersion implements DockerHubTagSource {
  constructor(private readonly tags: TagInfo[]) {}

  enumerate(): Tag[] {
    return this.tags
      .filter(tag => PATTERN_VERSION.test(tag.name))
      .map(this.map)
      .filter(tag => tag.version.arch === undefined)
      .sort((a, b) => (compare(a.name, b.name, '>') ? 1 : -1))
  }

  latest(currentVersion: string, limitVersion?: string): string {
    return this.enumerate().reduce((result, current) => {
      if (compare(current.version.value, currentVersion, '>')) {
        if (limitVersion && compare(current.version.value, limitVersion, '>')) {
          return result
        }

        return current.version.value
      }

      return result
    }, currentVersion)
  }

  latestVersions(currentVersion: string, limitVersion?: string): string[] {
    return this.enumerate().reduce<string[]>((result, current) => {
      if (compare(current.version.value, currentVersion, '>')) {
        if (limitVersion && compare(current.version.value, limitVersion, '>')) {
          return result
        }

        return [...result, current.version.value]
      }

      return result
    }, [])
  }

  private map(tag: TagInfo): Tag {
    const matches = PATTERN_VERSION.exec(tag.name)

    if (matches) {
      return {
        name: tag.name,
        value: tag.name,
        version: {
          original: tag.name,
          arch: matches[0],
          prerelease: matches[2],
          value: matches[1],
        },
      }
    }

    return {
      name: tag.name,
      value: tag.name,
      version: {
        original: tag.name,
        value: tag.name,
      },
    }
  }
}
