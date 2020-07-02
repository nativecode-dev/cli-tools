import { Merge } from '@nnode/common'

import { arraySort } from './ArraySort'
import { SortOptions, DefaultSortOptions } from './SortOptions'

export function objectSort<T extends any>(instance: T, options: Partial<SortOptions> = {}): T {
  const opts = Merge<SortOptions>(DefaultSortOptions, options)

  if (typeof instance !== 'object' || instance === null) {
    return instance
  }

  if (Array.isArray(instance)) {
    return instance
  }

  const hashobj = instance as any

  return Object.keys(hashobj)
    .sort()
    .reduce<T>((result: any, current: any) => {
      const value = (result[current] = hashobj[current])

      if (Array.isArray(value) && opts.sortArray) {
        result[current] = arraySort(value, opts)
      } else if (typeof value === 'object' && value !== null) {
        result[current] = objectSort(value, opts)
      }

      return result
    }, {} as T)
}
