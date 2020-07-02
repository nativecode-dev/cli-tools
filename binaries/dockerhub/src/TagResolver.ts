import { Tag } from './Tag'

export function tagResolver(tags: Tag[]): Tag[] {
  return tags.map((tag) => {
    if (/[a-zA-Z]+/g.test(tag.repotag.name)) {
      const matched = tags.find((x) => tag.repotag.full_size === x.repotag.full_size)

      if (matched) {
        tag.version = matched.version
      }
    }

    return tag
  })
}
