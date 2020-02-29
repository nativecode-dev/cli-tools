import { arraySort } from './ArraySort'

export function objectSort<T extends any>(instance: T): T {
  return Object.keys(instance)
    .sort()
    .reduce<T>((result, current) => {
      const value = (result[current] = instance[current])

      if (Array.isArray(value)) {
        result[current] = arraySort(value)
      } else if (typeof value === 'object' && value !== null) {
        result[current] = objectSort(value)
      }

      return result
    }, {} as T)
}
