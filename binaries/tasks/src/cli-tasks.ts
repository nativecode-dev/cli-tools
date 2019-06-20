import $yargs, { Arguments } from 'yargs'
import interactive, { OptionData } from 'yargs-interactive'

import { fs } from '@nofrills/fs'
import { Returns } from '@nofrills/patterns'

import { TaskBuilder } from './TaskBuilder'
import { TaskConfig } from './models/TaskConfig'

const booty = $yargs

export interface RootArguments {
  bail: boolean
  builder: TaskBuilder
  config: TaskConfig
  cwd: string
  help: boolean
  interactive: boolean
  list: boolean
  tasks: string[]
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

async function load(cwd: string): Promise<[TaskBuilder, TaskConfig]> {
  const exists = await fs.exists(cwd, false)
  const dirname = exists ? cwd : process.cwd()
  const builder = TaskBuilder.dir(dirname)
  return [builder, await builder.build()]
}

async function exec(args: Arguments<RootArguments>, ...tasks: string[]) {
  const code = await execute(args.builder, args.config, ...tasks)

  if (code !== 0 && args.bail) {
    throw new Error(`bailed with exit code: ${code}`)
  }

  return args
}

booty
  .command<RootArguments>('$0 [tasks..]', '', {
    aliases: ['@execute', '@exec', '@run', 'run-script', 'run-task'],
    builder: {},
    handler: async (args: Arguments<RootArguments>) => {
      const tasks = args.tasks || []

      if (tasks.length) {
        return exec(args)
      }

      const showInteractive = (args.interactive || tasks.length === 0) && !args.list

      if (showInteractive) {
        const tasks: OptionData = {
          choices: Object.keys(args.config.tasks),
          describe: 'select tasks',
          options: Object.keys(args.config.tasks),
          prompt: 'always',
          type: 'list',
        } as OptionData

        const answers = await interactive().interactive({
          interactive: { default: true },
          tasks,
        })

        return exec(args, answers.tasks)
      }

      if (args.list) {
        console.log('[tasks]')
        Object.keys(args.config.tasks).forEach(name => console.log(`  * ${name}`))
      }

      return args
    },
  })
  .middleware(async args => {
    const [builder, config] = await load(args.cwd)
    args.builder = builder
    args.config = config
  })
  .option('bail', {
    alias: 'b',
    boolean: true,
    default: false,
    describe: 'stops on first error',
  })
  .option('cwd', {
    alias: 'c',
    default: process.cwd(),
    describe: 'sets the current working directory',
  })
  .option('interactive', {
    alias: 'i',
    boolean: true,
    default: true,
    describe: 'interactive',
  })
  .option('list', {
    alias: 'l',
    boolean: true,
    default: false,
    describe: 'list available tasks',
  })
  .help()
  .parse()
