import { compare } from 'compare-versions'

import { Tag } from './Tag'
import { TagInfo } from './TagInfo'
import { DockerHubTagSource } from './DockerHubTagSource'

const PATTERN = /^v?((?:[0-9]+\.){2,3}[0-9]+)(?:-([\w\d]+))?$/m

export class DockerHubTagVersion implements DockerHubTagSource {
  constructor(private readonly tags: TagInfo[]) {}

  enumerate(): Tag[] {
    return this.tags
      .map(tag => tag.name)
      .filter(tag => PATTERN.test(tag))
      .reduce<Tag[]>((result, current) => {
        return [...result, { name: current, value: current }]
      }, [])
  }

  latest(currentVersion: string, limitVersion?: string): string {
    return this.enumerate().reduce((result, current) => {
      if (compare(current.value, currentVersion, '>')) {
        if (limitVersion && compare(current.value, limitVersion, '>')) {
          return result
        }

        return current.value
      }

      return result
    }, currentVersion)
  }

  latestVersions(currentVersion: string, limitVersion?: string): string[] {
    return this.enumerate().reduce<string[]>((result, current) => {
      if (compare(current.value, currentVersion, '>')) {
        if (limitVersion && compare(current.value, limitVersion, '>')) {
          return result
        }

        return [...result, current.value]
      }

      return result
    }, [])
  }
}
