import { fs } from '@nofrills/fs'

import { Sorters } from '../FileSort'
import { Logger } from '../../Logging'
import { FileSorter } from '../FileSorter'
import { objectSort } from '../ObjectSort'
import { SortOptions } from '../SortOptions'
import { SortResults } from '../SortResults'

const PATTERN = /\.json$/g
const logger = Logger.extend('json-sorter')

export const JsonSorter: FileSorter = {
  sort: async (filename: string, options: SortOptions): Promise<SortResults> => {
    try {
      const json = await fs.json(filename)
      const sorted = objectSort(json, options)
      const buffer = Buffer.from(JSON.stringify(sorted, null, 2))

      if (options.dryRun === false) {
        await fs.writeFile(filename, buffer)
      }

      return { filename, object: sorted }
    } catch (error) {
      logger.error(error)
      return { error, filename, object: null }
    }
  },

  sortable: (filename: string) => {
    return PATTERN.test(filename)
  },
}

Sorters.register(JsonSorter)
