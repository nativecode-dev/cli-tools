import { Tag } from '../Tag'
import { TagMatch } from '../TagMatch'

export function Pattern(value: string): TagMatch {
  return (tag: Tag) => new RegExp(value).test(tag.repository.name)
}
