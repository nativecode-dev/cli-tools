import deepequal from 'fast-deep-equal'

import { Tag } from './Tag'
import { RepositoryImage } from './Models/RepositoryImage'

export function TagResolve(tag: Tag, tags: Tag[]): Tag {
  const same = (source: RepositoryImage[], target: RepositoryImage[]) =>
    deepequal(source.map(img => img.digest).sort(), target.map(img => img.digest).sort())

  const found = tags
    .filter(source => same(source.repotag.images, tag.repotag.images))
    .reduce<Tag | null>((result, source) => (source.version ? source : result), null)

  if (found) {
    tag.version = found.version
  }

  return tag
}
