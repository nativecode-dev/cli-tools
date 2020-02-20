export interface OutputWriter<T> {
  write(date: T): void | Promise<void>
}
