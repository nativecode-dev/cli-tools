import $yargs, { Argv, Arguments } from 'yargs'
import interactive, { OptionData } from 'yargs-interactive'

import { fs } from '@nofrills/fs'
import { Returns } from '@nofrills/patterns'

import GLOBAL from './Globals'
import Logger from './Logging'

import { Options } from './Options'
import { TaskEvent } from './TaskEvent'
import { TaskBuilder } from './TaskBuilder'
import { TaskEntry } from './models/TaskEntry'
import { TaskConfig } from './models/TaskConfig'
import { TaskJobResult } from './models/TaskJobResult'

import ViewCommand from './commands/view'

const booty = $yargs
const log = Logger.extend('cli-tasks')

async function load(args: Arguments<Options>): Promise<[TaskBuilder, TaskConfig]> {
  const exists = await fs.exists(args.cwd, false)
  const dirname = exists ? args.cwd : process.cwd()
  const builder = TaskBuilder.dir(dirname)

  builder.on(TaskEvent.ConfigFile, (filename: string) => {
    if (args.info) {
      log.trace('[:merge]', filename)
    }
  })

  builder.on(TaskEvent.Execute, (entry: TaskEntry) => {
    if (args.info) {
      const normalized = entry.arguments || []
      log.trace(`[${entry.command}]`, normalized.join(' '))
    }
  })

  builder.on(TaskEvent.Results, (result: TaskJobResult) => {
    if (args.json) {
      result.messages = result.messages.reduce<string[]>((output, message) => output.concat(message.split('\n')), [])
      log.trace(GLOBAL.format(result, args.formatted))
    }
  })

  return [builder, await builder.build()]
}

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
      .map(result => Returns(result).after(() => (result.errors.length > 0 ? console.error(...result.errors) : void 0)))
      .map(result => result.code),
  )

  return code === 0 ? 0 : code
}

async function main(): Promise<any> {
  return booty
    .command<Options>('$0 [tasks..]', 'execute a given set of tasks', {
      aliases: ['@execute', '@exec', '@run', 'run-script', 'run-task'],
      builder: {},
      handler: async args => {
        const tasks = args.tasks || []

        if (tasks.length || args.json) {
          return exec(args, ...tasks)
        }

        const selectables = Object.keys(GLOBAL.config.tasks)

        const data: OptionData = {
          choices: selectables,
          describe: 'select tasks',
          options: selectables,
          prompt: 'always',
          type: 'list',
        } as OptionData

        const answers = await interactive().interactive({
          interactive: { default: true },
          tasks: data,
        })

        return exec(args, answers.tasks)
      },
    })
    .command(ViewCommand)
    .middleware(async args => {
      GLOBAL.arguments = args
      GLOBAL.cwd = process.env.NOFRILLS_CWD ? process.env.NOFRILLS_CWD : GLOBAL.arguments.cwd

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
        const json = JSON.stringify(GLOBAL.arguments)
        const buffer = Buffer.from(json)
        const encoded = buffer.toString('base64')
        process.env.NOFRILLS_TASKS_YARGS = encoded
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
    .option('formatted', {
      boolean: true,
      default: false,
      describe: 'formats output',
    })
    .option('json', {
      boolean: true,
      describe: 'json output',
    })
    .conflicts('info', 'json')
    .help()
    .parse()
}

main().catch(log.error)
