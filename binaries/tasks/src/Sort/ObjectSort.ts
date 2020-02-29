import { arraySort } from './ArraySort'
import { SortOptions } from './SortOptions'

export function objectSort<T extends any>(instance: T, options: SortOptions): T {
  return Object.keys(instance)
    .sort()
    .reduce<T>((result, current) => {
      const value = (result[current] = instance[current])

      if (Array.isArray(value) && options.sortArray) {
        result[current] = arraySort(value, options)
      } else if (typeof value === 'object' && value !== null) {
        result[current] = objectSort(value, options)
      }

      return result
    }, {} as T)
}
