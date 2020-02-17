import { Tag } from '../Tag'
import { TagMatcher } from '../TagMatcher'

export function OnlyReleases(): TagMatcher {
  return (tag: Tag) => {
    return tag.version !== null && tag.version.prerelease === undefined
  }
}
