import { fs } from '@nofrills/fs'

import { Sorters } from '../FileSort'
import { FileSorter } from '../FileSorter'
import { objectSort } from '../ObjectSort'
import { Logger } from '../../Logging'
import { SortOptions } from '../SortOptions'

const PATTERN = /\.json$/g
const logger = Logger.extend('json-sorter')

export const JsonSorter: FileSorter = {
  sort: async (filename: string, options: SortOptions) => {
    try {
      const json = await fs.json(filename)
      const sorted = objectSort(json)
      const buffer = Buffer.from(JSON.stringify(sorted, null, 2))
      await fs.writeFile(filename, buffer)
    } catch (error) {
      logger.error(error)
      return error
    }
  },

  sortable: (filename: string) => {
    return PATTERN.test(filename)
  },
}

Sorters.register(JsonSorter)
