import yargs from 'yargs'
import yargsInteractive, { Option } from 'yargs-interactive'

import { fs } from '@nofrills/fs'
import { CLI, ConsoleOptions, ProcessArgs } from '@nofrills/console'

import exec from './commands/exec'

import { Logger } from './Logging'
import { TaskBuilder } from './TaskBuilder'
import { ErrorCode } from './errors/ErrorCode'

const log = Logger.extend('console')

interface GlobalOptions {
  json: boolean
}

interface RunTaskOptions extends GlobalOptions {
  tasks: string[]
}

const options: ConsoleOptions = {
  initializer: async () => {
    try {
      const builder = TaskBuilder.file(process.cwd())
      const $config = await builder.build()
      log.debug('configuration', $config.tasks)

      const booty = Object.keys($config.tasks).reduce((build, name) => {
        return build.command<GlobalOptions>(name, name, {
          builder: {},
          handler: () => {
            try {
              return exec(builder, $config, name)
            } catch {
              booty.showHelp()
            }
          },
        })
      }, yargs)

      booty
        .command<RunTaskOptions>('$0 [tasks..]', 'run a set of tasks', {
          aliases: ['run-tasks'],
          builder: {},
          handler: async args => {
            if (args.tasks) {
              if (args.tasks.length === 1) {
                booty.showHelp()
              } else {
                await exec(builder, $config, ...args.tasks.slice(1))
              }
              return
            }

            // NOTE:
            // The currenty @types library does not properly model
            // how yargs-interactive works, so this hack gets around
            // the fact that "options" is now "choices".
            const tasks: Option = {
              tasks: {
                choices: Object.keys($config.tasks),
                default: Object.keys($config.tasks).shift(),
                describe: 'select tasks',
                options: Object.keys($config.tasks),
                prompt: 'if-no-arg',
                type: 'list',
              },
            } as Option

            const result = await yargsInteractive()
              .usage('$0 <command> [args]')
              .interactive({
                interactive: {
                  default: true,
                },
                ...tasks,
              })

            exec(builder, $config, result.tasks)
          },
        })
        .completion()
        .option('json', {
          boolean: true,
          default: false,
        })
        .scriptName(fs.basename(__filename, false))
        .help()
        .parse()
    } catch (error) {
      log.error(error)
      process.exitCode = ErrorCode.UncaughtException
      log.error(process.exitCode)
    }
  },
}

CLI.run(options, ProcessArgs.from(process.argv)).catch(log.error)
