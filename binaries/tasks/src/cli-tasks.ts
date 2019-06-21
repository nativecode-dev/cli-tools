import $yargs, { Arguments } from 'yargs'
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
    if (args.json === false) {
      log.trace('[:merge]', filename)
    }
  })

  builder.on(TaskEvent.Execute, (entry: TaskEntry) => {
    if (args.json === false) {
      const normalized = entry.arguments || []
      log.trace(`[${entry.command}]`, normalized.join(' '))
    }
  })

  builder.on(TaskEvent.Results, (result: TaskJobResult) => {
    if (args.json) log.trace(JSON.stringify(result, null, 2))
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

booty
  .command<Options>('$0 [tasks..]', 'execute a given set of tasks', {
    aliases: ['@execute', '@exec', '@run', 'run-script', 'run-task'],
    builder: {},
    handler: async args => {
      const tasks = args.tasks || []

      if (tasks.length || args.json) {
        return exec(args, ...tasks)
      }

      const data: OptionData = {
        choices: Object.keys(GLOBAL.config.tasks),
        describe: 'select tasks',
        options: Object.keys(GLOBAL.config.tasks),
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
    const [builder, config] = await load(args)
    GLOBAL.builder = builder
    GLOBAL.config = config
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
  .option('json', {
    boolean: true,
    default: false,
    describe: 'returns output as json',
  })
  .help()
  .parse()
