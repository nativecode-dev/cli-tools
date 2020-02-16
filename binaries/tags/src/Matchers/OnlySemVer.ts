import { RepositoryTag } from '../Models/RepositoryTag'
import { TagMatch } from '../TagMatch'
import { SemVerRegex } from '../TagVersionParse'

export function OnlySemVer(): TagMatch {
  return (tag: RepositoryTag) => SemVerRegex().test(tag.name)
}
