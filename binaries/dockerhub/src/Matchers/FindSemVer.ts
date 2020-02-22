import { compare } from 'compare-versions'

import { Tag } from '../Tag'
import { TagMatcher } from '../TagMatcher'
import { SemVerRegex } from '../TagVersionParse'

export function FindSemVer(current: string, maxVersion?: string): TagMatcher {
  return (tag: Tag) => {
    const valid = SemVerRegex().test(tag.repotag.name)
    const greaterThanCurrent = compare(tag.repotag.name, current, '>')
    const lessThanMax = maxVersion ? compare(tag.repotag.name, maxVersion, '<') : true
    return valid && greaterThanCurrent && lessThanMax
  }
}
