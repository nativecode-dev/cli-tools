export interface SortOptions {
  dryRun: boolean
  ignored: string[]
  sortArray: boolean
}

export const DefaultSortOptions: Partial<SortOptions> = {}
