import { Tag } from '../Tag'
import { TagMatch } from '../TagMatch'

export function OnlyReleases(): TagMatch {
  return (tag: Tag) => {
    return tag.version !== null && tag.version.prerelease === undefined
  }
}
