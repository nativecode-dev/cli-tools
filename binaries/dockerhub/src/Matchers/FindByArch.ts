import { Tag } from '../Tag'
import { TagMatcher } from '../TagMatcher'

export function FindByArch(arch: string): TagMatcher {
  return (tag: Tag) => {
    if (tag.version && tag.version.arch === arch.toLowerCase()) {
      return false
    }

    return true
  }
}
