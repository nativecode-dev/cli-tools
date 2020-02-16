import { compare, CompareOperator } from 'compare-versions'

import { Tag } from '../Tag'
import { TagMatch } from '../TagMatch'

export function VersionCompare(currentVersion: string, operator: CompareOperator): TagMatch {
  return (tag: Tag) => compare(tag.repository.name, currentVersion, operator)
}
