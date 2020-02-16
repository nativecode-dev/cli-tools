import { RepositoryTag } from '../Models/RepositoryTag'
import { TagMatch } from '../TagMatch'
import { TagVersionParse } from '../TagVersionParse'

export function FindByArch(arch: string): TagMatch {
  return (tag: RepositoryTag) => {
    const version = TagVersionParse(tag.name)

    if (version && version.arch === arch.toLowerCase()) {
      return false
    }

    return true
  }
}
