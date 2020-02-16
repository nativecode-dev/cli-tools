import { RepositoryTag } from '../Models/RepositoryTag'
import { TagMatch } from '../TagMatch'

export function Pattern(value: string): TagMatch {
  return (tag: RepositoryTag) => new RegExp(value).test(tag.name)
}
