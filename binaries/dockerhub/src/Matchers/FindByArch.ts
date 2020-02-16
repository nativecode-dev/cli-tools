import { Tag } from '../Tag'
import { TagMatch } from '../TagMatch'

export function FindByArch(arch: string): TagMatch {
  return (tag: Tag) => {
    if (tag.version && tag.version.arch === arch.toLowerCase()) {
      return false
    }

    return true
  }
}
