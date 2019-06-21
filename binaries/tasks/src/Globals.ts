import deepmerge from 'deepmerge'

import { Arguments } from 'yargs'

import { Options } from './Options'
import { TaskBuilder } from './TaskBuilder'
import { TaskConfig } from './models/TaskConfig'

export interface Globals {
  arguments: Arguments<Options>
  builder: TaskBuilder
  config: TaskConfig
  cwd: string
  format<T>(instance: T, formatted: boolean): string
  merge<T>(...source: T[]): T
}

const $GLOBAL: Partial<Globals> = {
  arguments: undefined,
  builder: undefined,
  config: undefined,
  cwd: process.cwd(),
  format: (instance, formatted) => (formatted ? JSON.stringify(instance, null, 2) : JSON.stringify(instance)),
  merge: (...sources) => deepmerge.all(sources),
}

// NOTE: This is a hack. Because we want the types
// to not be undefined, knowing that on startup we
// set them right away.
const GLOBAL: Globals = $GLOBAL as Globals

export default GLOBAL
