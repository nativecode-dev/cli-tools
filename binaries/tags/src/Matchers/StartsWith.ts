import { Tag } from '../Tag'
import { TagMatch } from '../TagMatch'

export function StartsWith(value: string): TagMatch {
  return (tag: Tag) => tag.repository.name.startsWith(value)
}
