import { Tag } from './Tag'

export interface TagMatcher {
  (tag: Tag): boolean
}
