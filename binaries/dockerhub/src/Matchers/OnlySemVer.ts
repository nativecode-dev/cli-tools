import { validate } from 'compare-versions'

import { Tag } from '../Tag'
import { TagMatch } from '../TagMatch'
import { SemVerRegex } from '../TagVersionParse'

export function OnlySemVer(): TagMatch {
  return (tag: Tag) => SemVerRegex().test(tag.repository.name) && validate(tag.repository.name)
}
