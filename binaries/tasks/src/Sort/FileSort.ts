import { all, Task } from 'promise-parallel-throttle'

import { FileSorter } from './FileSorter'
import { SortOptions } from './SortOptions'
import { Merge } from '@nnode/common'

const SORTERS = new Set<FileSorter>()

interface FileNameSorter {
  filename: string
  sorters: FileSorter[]
}

export module Sorters {
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

  export function sorters(filenames: string[]): FileNameSorter[] {
    return filenames.reduce<FileNameSorter[]>((results, filename) => [...results, sorter(filename)], [])
  }

  export async function sort(filenames: string[], options: Partial<SortOptions> = {}) {
    const opts = Merge<SortOptions>(options)

    const tasks = sorters(filenames).reduce<Task<Error | undefined>[]>((results, sorter) => {
      return [...results, ...sorter.sorters.map(x => () => x.sort(sorter.filename, opts))]
    }, [])

    const results = await all(tasks)

    return results.reduce<Error[]>((errors, current) => {
      if (current) {
        return [...errors, current]
      }
      return errors
    }, [])
  }
}
