import { compare } from 'compare-versions'

import { Tag } from './Tag'
import { TagInfo } from './TagInfo'

const PATTERN = /^v?((?:[0-9]+\.){2,3}[0-9]+)(?:-([\w\d]+))?$/m

export class DockerHubTagSearch {
  constructor(private readonly tags: TagInfo[]) {}

  enumerate(): Tag[] {
    return this.tags
      .map(tag => tag.name)
      .filter(tag => PATTERN.test(tag))
      .reduce<Tag[]>((result, current) => {
        return [...result, { name: current, version: current }]
      }, [])
  }

  latest(currentVersion: string, limitVersion?: string): string | null {
    return this.enumerate().reduce((result, current) => {
      if (compare(current.version, currentVersion, '>')) {
        if (limitVersion && compare(current.version, limitVersion, '>')) {
          return result
        }

        return current.version
      }

      return result
    }, currentVersion)
  }

  latestVersions(currentVersion: string, limitVersion?: string): string[] {
    return this.enumerate().reduce<string[]>((result, current) => {
      if (compare(current.version, currentVersion, '>')) {
        if (limitVersion && compare(current.version, limitVersion, '>')) {
          return result
        }

        return [...result, current.version]
      }

      return result
    }, [])
  }
}
