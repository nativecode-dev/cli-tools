import { Merge } from '@nnode/common'
import { all, Task } from 'promise-parallel-throttle'

import { FileSorter } from './FileSorter'
import { SortOptions } from './SortOptions'
import { SortResults } from './SortResults'

const SORTERS = new Set<FileSorter>()

const DefaultSortOptions: Partial<SortOptions> = {}

interface FileNameSorter {
  filename: string
  sorters: FileSorter[]
}

export namespace Sorters {
  export function register(sorter: FileSorter) {
    SORTERS.add(sorter)
  }

  export function unregister(sorter: FileSorter) {
    SORTERS.delete(sorter)
  }

  export function sorter(filename: string): FileNameSorter {
    return {
      filename,
      sorters: Array.from(SORTERS.values()).filter(sorter => sorter.sortable(filename)),
    }
  }

  export function sorters(filenames: string[], options: SortOptions): FileNameSorter[] {
    return filenames.reduce<FileNameSorter[]>((results, filename) => {
      const ignored = options.ignored.map(expression => new RegExp(expression, 'i')).some(regex => regex.test(filename))

      if (ignored) {
        return results
      }

      return [...results, sorter(filename)]
    }, [])
  }

  export async function sort(filenames: string[], options: Partial<SortOptions> = {}) {
    const opts = Merge<SortOptions>(DefaultSortOptions, options)
    const sortables = sorters(filenames, opts)

    const tasks = sortables.reduce<Task<SortResults>[]>((results, sortable) => {
      return [...results, ...sortable.sorters.map(x => () => x.sort(sortable.filename, opts))]
    }, [])

    const results = await all(tasks)

    return results.reduce<SortResults[]>((errors, current) => {
      if (current) {
        return [...errors, current]
      }
      return errors
    }, [])
  }
}
