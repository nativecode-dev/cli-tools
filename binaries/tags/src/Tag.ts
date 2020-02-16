import { TagVersion } from './TagVersion'
import { RepositoryTag } from './Models/RepositoryTag'

export interface Tag {
  repository: RepositoryTag
  version: TagVersion | null
}
