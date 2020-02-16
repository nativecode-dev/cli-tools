import readline from 'readline'

import { CommandModule } from 'yargs'
import { ConfigFile } from '../Config/ConfigFile'
import { DockerHubClient } from '../DockerHubClient'
import { DockerHubBuilder } from '../DockerHubBuilder'
import { DockerHubLoginOptions } from './DockerHubLoginOptions'

export class DockerHubLogin implements CommandModule<{}, DockerHubLoginOptions> {
  aliases = ['login', 'logon']
  command = 'login <username> [password]'

  builder: DockerHubBuilder = {
    'passwd-stdin': {
      default: false,
      type: 'boolean',
    },
  }

  handler = async (args: DockerHubLoginOptions) => {
    const client = new DockerHubClient()

    if (args.password === undefined || args.passwdStdin) {
      args.password = await this.password()
    }

    const token = await client.auth.login(args.username, args.password)
    return ConfigFile.save(ConfigFile.filename, { auth_token: token, username: args.username })
  }

  private password(): Promise<string> {
    const reader = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true })

    return new Promise(async (resolve, reject) =>
      reader.question('Password:', password => {
        try {
          reader.close()
          resolve(password)
        } catch (error) {
          reject(error)
        }
      }),
    )
  }
}

export const LoginCommand = new DockerHubLogin()
