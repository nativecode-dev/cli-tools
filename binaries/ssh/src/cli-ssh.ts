import { CLI, ConsoleOptions, ProcessArgs } from '@nofrills/console'

import { fs } from '@nofrills/fs'
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
      console.log(sshconfig)
    }
  },
}

CLI.run(options, args).catch(console.log)
