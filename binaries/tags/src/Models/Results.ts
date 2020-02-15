export interface RepositoryResults<T> {
  count: number
  next: any | null
  previous: any | null
  results: T[]
}
