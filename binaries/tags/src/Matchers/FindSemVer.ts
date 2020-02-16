import { compare } from 'compare-versions'

import { RepositoryTag } from '../Models/RepositoryTag'
import { TagMatch } from '../TagMatch'
import { SemVerRegex } from '../TagVersionParse'

export function FindSemVer(current: string, maxVersion?: string): TagMatch {
  return (tag: RepositoryTag) => {
    const valid = SemVerRegex().test(tag.name)
    const greaterThanCurrent = compare(tag.name, current, '>=')
    const lessThanMax = maxVersion ? compare(tag.name, maxVersion, '<') : true
    return valid && greaterThanCurrent && lessThanMax
  }
}
