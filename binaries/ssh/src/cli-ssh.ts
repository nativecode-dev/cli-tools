import { fs } from '@nofrills/fs'
import { CLI, ConsoleOptions, ProcessArgs } from '@nofrills/console'

import { SshParser } from './SshParser'

const args = ProcessArgs.from(process.argv)

const options: ConsoleOptions = {
  initializer: async () => {
    const ssh = SshParser.from(process.cwd(), 'config.pegjs')
    const parser = await ssh.generate()
    const home = fs.resolve('~')
    const config = `${home}/.ssh/config`
    if (await fs.exists(config)) {
      const buffer = await fs.readFile(config)
      const sshconfig = parser.parse(buffer.toString())
      // TODO: Remove
      process.stdout.write(Buffer.from(sshconfig))
    }
  },
}

CLI.run(options, args).catch(console.error)
