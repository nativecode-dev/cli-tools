import 'mocha'

import { fs } from '@nofrills/fs'

import expect from './expect'

import { TaskJob } from '../src/models/TaskJob'
import { TaskBuilder } from '../src/TaskBuilder'
import { TaskConfig } from '../src/models/TaskConfig'
import { TaskRunner } from '../src/runners/TaskRunner'
import { TaskJobResult } from '../src/models/TaskJobResult'
import { SerialTaskRunner } from '../src/runners/SerialTaskRunner'
import { TaskRunnerAdapter } from '../src/runners/TaskRunnerAdapter'

const assets = fs.join(__dirname, 'assets')

describe('when using TaskRunner', () => {
  const builder = TaskBuilder.dir(assets)

  class TestAdapter implements TaskRunnerAdapter {
    readonly stdin: NodeJS.ReadStream = process.stdin
    readonly stdout: NodeJS.WriteStream = process.stdout
    readonly stderr: NodeJS.WriteStream = process.stderr

    execute(job: TaskJob): Promise<TaskJobResult[]> {
      return Promise.resolve(
        job.task.entries.map(entry => ({
          code: 0,
          entry,
          errors: [],
          messages: [],
          signal: null,
        })),
      )
    }
  }

  it('should execute tasks', async () => {
    const config = await builder.build()
    const runner = new TaskRunner(config, new TestAdapter())
    const results = await runner.run(['test'])
    await fs.save(fs.join(__dirname, 'assets/tasks-expanded.json'), config)
    expect(results).to.be.lengthOf(6)
  })

  it('should execute real tasks', async () => {
    const config: TaskConfig = {
      tasks: {
        which: [
          {
            arguments: ['node'],
            command: 'which',
            name: 'which',
          },
        ],
      },
    }

    const runner = new TaskRunner(config, new TestAdapter())
    const results = await runner.run(['which'])
    expect(results).to.be.lengthOf(1)
  })

  it.skip('should change shell to bash', async () => {
    const config: TaskConfig = {
      tasks: {
        echo: {
          entries: [
            {
              arguments: ['$0'],
              command: 'echo',
              name: 'echo',
            },
          ],
        },
      },
    }

    const runner = new TaskRunner(config, new TestAdapter())
    const results = await runner.run(['echo'])
    expect(results[0].messages).to.contain('/bin/sh')
  })

  it.skip('should change shell to bash', async () => {
    const config: TaskConfig = {
      tasks: {
        echo: {
          entries: [
            {
              arguments: ['$0'],
              command: 'echo',
              name: 'echo',
            },
          ],
          shell: '/bin/bash',
        },
      },
    }

    const runner = new TaskRunner(config, new TestAdapter())
    const results = await runner.run(['echo'])
    expect(results[0].messages).to.contain('/bin/bash')
  })

  it.skip('should set environment variable', async () => {
    const config: TaskConfig = {
      tasks: {
        env: ['$SIMPLE test'],
      },
    }

    const env: NodeJS.ProcessEnv = { PATH: '' }
    const runner = new TaskRunner(config, new TestAdapter())
    await runner.run(['env'], undefined, env)

    expect(env.SIMPLE).to.equal('test')
  })

  xdescribe('variable expansion', () => {
    it('should expand environment variables', async () => {
      const config: TaskConfig = {
        tasks: {
          env: ['echo ${SIMPLE}'],
        },
      }

      const env: NodeJS.ProcessEnv = {
        SIMPLE: 'test',
      }

      const runner = new TaskRunner(config, new SerialTaskRunner())
      const results = await runner.run(['env'], process.cwd(), env)

      const splat = results
        .filter(result => result.messages)
        .reduce<string[]>((collection, messages) => collection.concat(messages.messages), [])

      expect(splat).to.includes('test')
    })
  })
})
