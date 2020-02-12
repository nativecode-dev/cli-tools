import semver from 'semver'

import { Tag } from './Tag'

const PATTERN = /v((?:[0-9]+\.){2}[0-9]+)(?:-([\w\d]+))?/g

export class DockerHubTagSearch {
  constructor(private readonly tags: Tag[]) {}

  enumerate(): string[] {
    return this.tags.reduce<string[]>((result, current) => {
      const cleaned = this.clean(current.name)

      if (cleaned) {
        return [...result, cleaned]
      }

      return result
    }, [])
  }

  latest(currentVersion: string): string | null {
    return semver.sort(this.enumerate()).reduce<string | null>((result, version) => {
      if (semver.gt(version, this.cleanVersion(currentVersion))) {
        return version
      }

      return result
    }, null)
  }

  latestVersions(currentVersion: string): string[] {
    return semver.sort(this.enumerate()).reduce<string[]>((result, version) => {
      if (semver.gt(version, currentVersion)) {
        return [...result, version]
      }

      return result
    }, [])
  }

  private clean(version: string): string | null {
    const coerced = semver.coerce(version)

    if (PATTERN.test(version) || semver.valid(coerced)) {
      const cleaned = semver.clean(version)

      if (cleaned !== null) {
        return cleaned
      }
    }

    return null
  }

  private cleanVersion(version: string): string {
    const cleaned = this.clean(version)

    if (cleaned === null) {
      return version
    }

    return cleaned
  }
}
