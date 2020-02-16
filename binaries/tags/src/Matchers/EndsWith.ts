import { Tag } from '../Tag'
import { TagMatch } from '../TagMatch'

export function EndsWith(value: string): TagMatch {
  return (tag: Tag) => tag.repository.name.endsWith(value)
}
