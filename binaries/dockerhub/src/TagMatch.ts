import { Tag } from './Tag'
import { TagMatcher } from './TagMatcher'

export function tagMatch(tags: Tag[], matcher: TagMatcher) {
  return tags.reduce<Tag[]>((results, tag) => {
    const matches = matcher(tag)

    if (matches) {
      results.push(tag)
    }

    return results
  }, [])
}
