import $yargs, { Arguments } from 'yargs'
import $ui, { OptionData } from 'yargs-interactive'

import { fs } from '@nofrills/fs'

import GLOBAL from './command-line/Globals'
import Logger from './Logging'

import { Options } from './command-line/Options'
import { TaskEvent } from './tasks/TaskEvent'
import { TaskBuilder } from './tasks/TaskBuilder'
import { TaskEntry } from './models/TaskEntry'
import { TaskConfig } from './models/TaskConfig'
import { TaskJobResult } from './models/TaskJobResult'

import ViewOptions from './command-line/commands/view'

const booty = $yargs
const log = Logger.extend('cli-tasks')

const ERRORS: TaskJobResult[] = []

async function exec(args: Arguments<Options>, ...tasks: string[]): Promise<Arguments<Options>> {
  const code = await execute(GLOBAL.builder, GLOBAL.config, ...tasks)

  if (code !== 0 && args.bail) {
    throw new Error(`bailed with exit code: ${code}`)
  }

  return args
}

async function execute(builder: TaskBuilder, config: TaskConfig, ...tasks: string[]): Promise<number> {
  const results = await builder.run(tasks, config)

  const code: number = Math.max(
    ...results
      .map(result => ({ code: result.code, errors: result.errors, messages: result.messages, job: result.entry }))
      .map(result => result.code),
  )

  return code === 0 ? 0 : code
}

async function load(args: Arguments<Options>): Promise<[TaskBuilder, TaskConfig]> {
  const exists = await fs.exists(args.cwd, false)
  const dirname = exists ? args.cwd : process.cwd()
  const builder = TaskBuilder.dir(dirname)
  return [builder, await builder.build()]
}

function timing(): void {
  const seconds = GLOBAL.elapsed(GLOBAL.startup)
  log.trace(`[@${GLOBAL.cwd}] took ${seconds} seconds to execute`)
}

process.on('beforeExit', () => {
  const MAX_ERROR_CODE = Math.max(...ERRORS.map(error => error.code))
  process.exitCode = MAX_ERROR_CODE
})

booty
  .command(ViewOptions)
  .command<Options>('$0 [tasks..]', 'execute a given set of tasks', {
    aliases: ['@execute', '@exec', '@run', 'run-script', 'run-task'],
    builder: {},
    handler: async (args: Arguments<Options>) => {
      const tasks = args.tasks || []

      if (tasks.length || args.json) {
        return exec(args, ...tasks)
      }

      const selectables = Object.keys(GLOBAL.config.tasks)
      const options = {
        interactive: { default: true },
        tasks: {
          choices: selectables,
          describe: 'select task to run',
          options: selectables,
          prompt: 'always',
          type: 'list',
        } as OptionData,
      }

      const answers = await Promise.resolve($ui().interactive(options))
      await exec(args, answers.tasks)
    },
  })
  .middleware(async (args: Arguments<Options>) => {
    GLOBAL.arguments = args
    GLOBAL.cwd = process.env.NOFRILLS_CWD ? process.env.NOFRILLS_CWD : GLOBAL.arguments.cwd

    process.on('beforeExit', () => {
      if (GLOBAL.arguments.timings) timing()
    })

    if (process.env.NOFRILLS_TASKS_YARGS) {
      const content = String(process.env.NOFRILLS_TASKS_YARGS)
      const buffer = Buffer.from(content, 'base64')
      const json = JSON.parse(buffer.toString())
      GLOBAL.arguments = GLOBAL.merge(json, args, GLOBAL.arguments)
    } else {
      // NOTE: Setup an environment variable to store our arguments as base64 encoded JSON
      // so we can retrieve later. This is specifically for passing arguments to child
      // processes that we spawned from our instance.
      GLOBAL.arguments.info = GLOBAL.arguments.json ? false : true
      GLOBAL.arguments.timings = GLOBAL.arguments.json ? false : GLOBAL.arguments.timings
      const json = JSON.stringify(GLOBAL.arguments)
      const buffer = Buffer.from(json)
      const encoded = buffer.toString('base64')
      process.env.NOFRILLS_TASKS_YARGS = encoded
    }

    if (GLOBAL.arguments.debug) {
      log.trace('[:args]', process.argv.join(' '))
      log.trace('[:cwd]', process.cwd())
    }

    const [builder, config] = await load(GLOBAL.arguments)
    GLOBAL.builder = builder
    GLOBAL.config = config

    return GLOBAL.arguments
  })
  .option('bail', {
    alias: 'b',
    boolean: true,
    default: false,
    describe: 'stops on first error',
  })
  .option('cwd', {
    default: process.cwd(),
    describe: 'sets the current working directory',
  })
  .option('debug', {
    alias: 'd',
    boolean: true,
    default: false,
    describe: 'enable debug messages',
  })
  .option('formatted', {
    alias: 'f',
    boolean: true,
    default: false,
    describe: 'formats output',
  })
  .option('json', {
    alias: 'j',
    boolean: true,
    default: false,
    describe: 'json output',
  })
  .option('timings', {
    alias: 't',
    boolean: true,
    default: false,
    describe: 'show timings',
  })
  .help()
  .showHelpOnFail(false)
  .parse()
