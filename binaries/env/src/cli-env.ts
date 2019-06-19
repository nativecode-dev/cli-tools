import yargs from 'yargs'

import { fs } from '@nofrills/fs'
import { DictionaryOf } from '@nofrills/collections'

export interface Interpolate {
  cwd: string
  destination: string
  filenames: string[]
}

async function files(cwd: string, filenames: string[]): Promise<string[]> {
  const normalized = filenames.map(filename => fs.join(cwd, filename))

  const filtered = await Promise.all(
    normalized.map(async filename => {
      if (await fs.exists(filename)) {
        return filename
      }
      return null
    }),
  )

  return filtered.reduce<string[]>((result, file) => {
    if (file) {
      result.push(file)
    }
    return result
  }, [])
}

function interpolate(env: DictionaryOf<string | undefined>, content: string): string {
  return Object.keys(env)
    .map(name => {
      const expression = `$\{${name}\}`
      return (text: string) => {
        const regex = new RegExp(expression, 'g')
        const value = process.env[name]
        return value ? text.replace(regex, value) : text
      }
    })
    .reduce((result, current) => {
      return current(result)
    }, content)
}

const args = yargs
  .help()
  .scriptName(fs.basename(__filename, false))
  .command<Interpolate>('interpolate [filenames..]', 'replaces environment variables in a file(s)', {
    aliases: ['replace'],
    builder: {
      cwd: {
        alias: 'cwd',
        default: process.cwd(),
      },
      destination: {
        alias: 'dest',
        default: process.cwd(),
      },
      lineEndings: {
        alias: 'eol',
        choices: ['crlf', 'lf', 'ignore'],
        default: 'ignore',
      },
    },
    handler: async args => {
      const filenames = await files(args.cwd, args.filenames)

      return Promise.all(
        filenames
          .map(filepath => ({ filepath, buffer: fs.readFile(filepath) }))
          .map(async fileinfo => {
            const buffer = await fileinfo.buffer
            const destination = fs.join(args.destination, fs.basename(fileinfo.filepath))
            console.log(`interpolating ${fileinfo.filepath} -> ${destination}`)
            return interpolate(process.env, buffer.toString())
          }),
      )
    },
  }).argv

console.debug('arguments', args)
