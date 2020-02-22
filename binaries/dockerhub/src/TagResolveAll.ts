import { Tag } from './Tag'
import { tagResolve } from './TagResolve'

export function tagResolveAll(tags: Tag[]): Tag[] {
  return tags.map(tag => tagResolve(tag, tags))
}
