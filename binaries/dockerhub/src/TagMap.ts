import { tagVersionParse } from './TagVersionParse'
import { RepositoryTag } from './Models/RepositoryTag'

export function tagMap(tags: RepositoryTag[]) {
  return tags.map((tag) => ({ references: [], repotag: tag, version: tagVersionParse(tag.name) }))
}
