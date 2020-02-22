import { Tag } from './Tag'

export function tagResolver(tags: Tag[]): Tag[] {
  return tags.map(tag => {
    if (/[a-zA-Z]+/g.test(tag.repository.name)) {
      const matched = tags.find(x => tag.repository.full_size === x.repository.full_size)

      if (matched) {
        tag.version = matched.version
      }
    }

    return tag
  })
}
