export interface CliArguments {
  _: string[]
  $0: string
  [x: number]: unknown
  [x: string]: unknown
}

export interface TaskArguments extends CliArguments {
  logLevel: string
  task: string
}
