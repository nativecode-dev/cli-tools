import { compare } from 'compare-versions'

import { Tag } from '../Tag'
import { TagMatch } from '../TagMatch'
import { SemVerRegex } from '../TagVersionParse'

export function FindSemVer(current: string, maxVersion?: string): TagMatch {
  return (tag: Tag) => {
    const valid = SemVerRegex().test(tag.repository.name)
    const greaterThanCurrent = compare(tag.repository.name, current, '>=')
    const lessThanMax = maxVersion ? compare(tag.repository.name, maxVersion, '<') : true
    return valid && greaterThanCurrent && lessThanMax
  }
}
