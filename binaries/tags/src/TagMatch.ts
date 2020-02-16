import { RepositoryTag } from './Models/RepositoryTag'

export interface TagMatch {
  (tag: RepositoryTag): boolean
}
