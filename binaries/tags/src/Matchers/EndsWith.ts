import { RepositoryTag } from '../Models/RepositoryTag'
import { TagMatch } from '../TagMatch'

export function EndsWith(value: string): TagMatch {
  return (tag: RepositoryTag) => tag.name.endsWith(value)
}
