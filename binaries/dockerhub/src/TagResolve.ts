import deepequal from 'fast-deep-equal'

import { compare, validate } from 'compare-versions'

import { Tag } from './Tag'
import { RepositoryImage } from './Models/RepositoryImage'
import { tagSort } from './TagSort'

export function tagResolve(tag: Tag, tags: Tag[]): Tag {
  const same = (source: RepositoryImage[], target: RepositoryImage[]) =>
    deepequal(source.map(img => img.digest).sort(), target.map(img => img.digest).sort())

  const references = tags
    .filter(source => source !== tag)
    .filter(source => same(source.repotag.images, tag.repotag.images))

  tag.references = tag.references.concat(references).sort(tagSort())

  const found = references.reduce<Tag | null>((result, source) => {
    const src = validate(source.repotag.name) ? source : null
    const tgt = validate(tag.repotag.name) ? tag : null

    if (src && tgt) {
      return compare(src.repotag.name, tgt.repotag.name, '>') ? source : result
    }

    return source.version ? source : result
  }, null)

  if (found) {
    tag.version = found.version
  }

  return tag
}
