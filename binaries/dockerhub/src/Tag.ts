import { TagVersion } from './TagVersion'
import { RepositoryTag } from './Models/RepositoryTag'

export interface Tag {
  references: Tag[]
  repotag: RepositoryTag
  version: TagVersion | null
}
