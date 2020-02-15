import { Tag } from './Models/Tag'

export interface TagFilter {
  (tag: Tag): boolean
}
