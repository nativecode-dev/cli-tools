import { Tag } from '../Tag'
import { TagMatch } from '../TagMatch'

export function NoArch(): TagMatch {
  return (tag: Tag) => {
    if (tag.version && tag.version.arch) {
      return false
    }

    return true
  }
}
