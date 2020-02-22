import { Tag } from '../Tag'
import { TagMatcher } from '../TagMatcher'

export function EndsWith(value: string): TagMatcher {
  return (tag: Tag) => tag.repotag.name.endsWith(value)
}
