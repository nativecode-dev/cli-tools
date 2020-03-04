import { Merge } from '@nnode/common'

import { SortOptions, DefaultSortOptions } from './SortOptions'

export function arraySort<T extends any>(array: T[], options: Partial<SortOptions> = {}): T[] {
  const opts = Merge<SortOptions>(DefaultSortOptions, options)
  return array.sort()
}
