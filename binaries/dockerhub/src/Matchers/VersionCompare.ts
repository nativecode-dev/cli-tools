import { compare, CompareOperator, validate } from 'compare-versions'

import { Tag } from '../Tag'
import { TagMatcher } from '../TagMatcher'
import { TagVersionParse } from '../TagVersionParse'

export function VersionCompare(currentVersion: string, operator: CompareOperator): TagMatcher {
  const current = TagVersionParse(currentVersion)

  return (tag: Tag) => {
    if (current && validate(current.original)) {
      if (tag.version && validate(tag.version.original)) {
        return compare(tag.version.original, current.original, operator)
      }

      if (validate(tag.repotag.name)) {
        return compare(tag.repotag.name, current.original, operator)
      }
    }

    return tag.repotag.name > currentVersion
  }
}
