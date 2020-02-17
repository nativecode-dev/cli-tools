import { Tag } from '../Tag'
import { TagMatcher } from '../TagMatcher'

export function Pattern(value: string): TagMatcher {
  return (tag: Tag) => new RegExp(value).test(tag.repotag.name)
}
