import { SortOptions } from './SortOptions'
import { SortResults } from './SortResults'

export interface FileSorter {
  sort(filename: string, options: SortOptions): Promise<SortResults>
  sortable(filename: string): boolean
}
