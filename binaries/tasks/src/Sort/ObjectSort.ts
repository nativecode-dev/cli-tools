import { Merge, DeepPartial } from '@nnode/common'

import { arraySort } from './ArraySort'
import { SortOptions, DefaultSortOptions } from './SortOptions'

export function objectSort<T extends any>(instance: T, options: Partial<SortOptions> = {}): T {
  const opts = Merge<SortOptions>(DefaultSortOptions, options)

  if (typeof instance !== 'object' || instance === null) {
    return {} as T
  }

  if (Array.isArray(instance)) {
    const instances: T[] = instance
    return instances.reduce<T>(
      (result, current) => Merge<T>(result as DeepPartial<T>, objectSort(current) as DeepPartial<T>),
      {} as T,
    )
  }

  if (typeof instance === 'object' && instance !== null) {
    const instanceObject: any = instance

    return Object.keys(instanceObject)
      .sort()
      .reduce<T>((result: any, current) => {
        const value: any = (result[current] = instanceObject[current])

        if (Array.isArray(value) && opts.sortArray) {
          result[current] = arraySort(value, opts)
        } else if (typeof value === 'object' && value !== null) {
          result[current] = objectSort(value, opts)
        }

        return result
      }, {} as T)
  }

  throw new Error('what the hell')
}
