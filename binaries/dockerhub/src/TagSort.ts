import { compare, validate } from 'compare-versions'

import { Tag } from './Tag'

export function tagSort(reverse: boolean = false): (source: Tag, target: Tag) => number {
  const operator = () => (reverse ? '<' : '>')

  return (source: Tag, target: Tag): number => {
    const src = source.version && validate(source.version.original) ? source.version : null
    const tgt = target.version && validate(target.version.original) ? target.version : null

    if (src && tgt) {
      return compare(src.original, tgt.original, operator()) ? 1 : -1
    }

    if (source.repotag.name === target.repotag.name) {
      return 0
    }

    return source.repotag.name > target.repotag.name ? 1 : -1
  }
}
