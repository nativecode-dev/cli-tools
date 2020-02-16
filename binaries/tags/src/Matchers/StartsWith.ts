import { TagMatch } from '../TagMatch'
import { RepositoryTag } from '../Models/RepositoryTag'

export function StartsWith(value: string): TagMatch {
  return (tag: RepositoryTag) => tag.name.startsWith(value)
}
