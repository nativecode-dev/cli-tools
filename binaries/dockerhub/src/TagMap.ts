import { RepositoryTag } from './Models'
import { TagVersionParse } from './TagVersionParse'

export function TagMap(tags: RepositoryTag[]) {
  return tags.map(tag => ({ repotag: tag, version: TagVersionParse(tag.name) }))
}
