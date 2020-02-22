export interface TaskFull {
  commands?: {
    arguments?: string[]
    exitOnFail?: boolean
    name?: string
    runnable?: boolean
    [k: string]: any
  }[]
  [k: string]: any
}
