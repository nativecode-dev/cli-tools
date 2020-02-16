import { TagMatch } from '../TagMatch'
import { RepositoryTag } from '../Models/RepositoryTag'
import { TagVersionParse } from '../TagVersionParse'

export function OnlyReleases(): TagMatch {
  return (tag: RepositoryTag) => {
    const version = TagVersionParse(tag.name)
    return version !== null && version.prerelease === undefined
  }
}
