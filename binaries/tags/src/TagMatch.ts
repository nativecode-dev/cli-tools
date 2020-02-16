import { Tag } from './Tag'

export interface TagMatch {
  (tag: Tag): boolean
}
