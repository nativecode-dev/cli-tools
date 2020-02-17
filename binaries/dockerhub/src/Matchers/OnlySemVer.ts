import { validate } from 'compare-versions'

import { Tag } from '../Tag'
import { TagMatcher } from '../TagMatcher'
import { SemVerRegex } from '../TagVersionParse'

export function OnlySemVer(): TagMatcher {
  return (tag: Tag) => SemVerRegex().test(tag.repotag.name) && validate(tag.repotag.name)
}
