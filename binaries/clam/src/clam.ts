import findup from 'find-up'
import deepmerge from 'deepmerge'

import { Argv } from 'yargs'
import { fs } from '@nofrills/fs'

import Logger from './Logging'
import ClamShell from './ClamShell'

import ClamOptions, { ClamOptions as Options } from './ClamOptions'
import { ClamConfig } from './ClamConfig'

import LoggingMiddleware from './middleware/LoggingMiddleware'

const DefaultConfig: ClamConfig = {
  plugins: [],
}

async function configuration() {
  const log = Logger.extend('configuration')
  const filename = await findup(['.clamrc', '.clamrc.json'])

  if (filename) {
    log.trace(':configuration', filename)
    const json = await fs.json<ClamConfig>(filename)
    const merged = deepmerge.all<ClamConfig>([DefaultConfig, json])
    return ClamShell().config(merged)
  } else {
    log.trace(':configuration', 'none')
    return ClamShell().config(DefaultConfig)
  }
}

async function main() {
  const yargs = await configuration()
  ClamOptions(LoggingMiddleware(yargs as Argv<Options>)).parse()
}

main().catch(Logger.error)
