import { Tag } from './Tag'
import { TagMatcher } from './TagMatcher'

export function TagMatch(tags: Tag[], matcher: TagMatcher) {
  return tags.reduce<Tag[]>((results, tag) => {
    const matches = matcher(tag)

    if (matches) {
      results.push(tag)
    }

    return results
  }, [])
}
