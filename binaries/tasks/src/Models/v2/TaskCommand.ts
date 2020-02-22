export interface TaskCommand {
  [key: string]: string | string[] | boolean | undefined
  arguments: string[]
  exitOnFail?: boolean
  name: string
  runnable?: boolean
}
