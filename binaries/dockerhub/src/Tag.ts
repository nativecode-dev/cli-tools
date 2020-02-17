import { TagVersion } from './TagVersion'
import { RepositoryTag } from './Models/RepositoryTag'

export interface Tag {
  repotag: RepositoryTag
  version: TagVersion | null
}
