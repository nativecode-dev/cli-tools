import { Tag } from '../Tag'
import { TagMatcher } from '../TagMatcher'

export function StartsWith(value: string): TagMatcher {
  return (tag: Tag) => tag.repotag.name.startsWith(value)
}
