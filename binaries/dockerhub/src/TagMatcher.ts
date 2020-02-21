import { Tag } from './Tag'
import { TagMatch } from './TagMatch'

export function tagMatcher(matcher: TagMatch, tags: Tag[]): Tag[] {
  return tags.reduce<Tag[]>((results, tag) => {
    const matches = matcher(tag)

    if (matches) {
      results.push(tag)
    }

    return results
  }, [])
}
