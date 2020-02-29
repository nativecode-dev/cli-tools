import { SortOptions } from './SortOptions'

export interface FileSorter {
  sort(filename: string, options: SortOptions): Promise<Error | undefined>
  sortable(filename: string): boolean
}
