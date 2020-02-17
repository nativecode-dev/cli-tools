import { Tag } from './Tag'
import { TagResolve } from './TagResolve'

export function TagResolveAll(tags: Tag[]): Tag[] {
  return tags.map(tag => TagResolve(tag, tags))
}
