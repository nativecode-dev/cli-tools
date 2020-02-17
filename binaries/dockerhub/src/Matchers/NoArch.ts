import { Tag } from '../Tag'
import { TagMatcher } from '../TagMatcher'

export function NoArch(): TagMatcher {
  return (tag: Tag) => {
    if (tag.version && tag.version.arch) {
      return false
    }

    return true
  }
}
