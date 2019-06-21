import deepmerge from 'deepmerge'

import { Arguments } from 'yargs'

import { Options } from './Options'
import { TaskBuilder } from './TaskBuilder'
import { TaskConfig } from './models/TaskConfig'

export interface State {
  arguments: Arguments<Options>
  builder: TaskBuilder
  config: TaskConfig
  cwd: string
  startup: Date
  elapsed(date: Date): [number, number, number, number]
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

    const daysDifference = Math.floor(difference / 1000 / 60 / 60 / 24)
    const hoursDifference = Math.floor(difference / 1000 / 60 / 60)
    const minutesDifference = Math.floor(difference / 1000 / 60)
    const secondsDifference = Math.floor(difference / 1000)

    return [daysDifference, hoursDifference, minutesDifference, secondsDifference]
  },
  format: (instance, formatted) => (formatted ? JSON.stringify(instance, null, 2) : JSON.stringify(instance)),
  merge: (...sources) => deepmerge.all(sources),
}

// NOTE: This is a hack. Because we want the types
// to not be undefined, knowing that on startup we
// set them right away.
const GLOBAL: State = $GLOBAL as State

export default GLOBAL
