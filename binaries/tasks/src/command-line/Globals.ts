import deepmerge from 'deepmerge'

import { Arguments } from 'yargs'

import { Options } from './Options'
import { TaskBuilder } from '../tasks/TaskBuilder'
import { TaskConfig } from '../models/TaskConfig'

export interface State {
  arguments: Arguments<Options>
  builder: TaskBuilder
  config: TaskConfig
  cwd: string
  startup: Date
  elapsed(date: Date): number
  format<T>(instance: T, formatted: boolean): string
  merge<T>(...source: T[]): T
}

const $GLOBAL: Partial<State> = {
  arguments: undefined,
  builder: undefined,
  config: undefined,
  cwd: process.cwd(),
  startup: new Date(),
  elapsed: date => {
    const now = new Date().getTime()
    const difference = now - date.getTime()
    return Math.floor(difference / 1000)
  },
  format: (instance, formatted) => (formatted ? JSON.stringify(instance, null, 2) : JSON.stringify(instance)),
  merge: (...sources) =>
    deepmerge.all(sources, {
      arrayMerge: (target, source) => {
        const src = new Set([...target, ...source])
        return Array.from(src.values())
      },
    }),
}

// NOTE: This is a hack. Because we want the types
// to not be undefined, knowing that on startup we
// set them right away.
const GLOBAL: State = $GLOBAL as State

export default GLOBAL
