import yargs from 'yargs'

import { fs } from '@nofrills/fs'
import { DictionaryOf } from '@nofrills/collections'

export enum DataType {
  Json = 'json',
  Raw = 'raw',
}

export interface Interpolate {
  cwd: string
  destination: string
  filenames: string[]
  json: boolean
  output: DataType
  save: boolean
}

export interface Interpolated {
  filename: string
  rendered: string
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
      const expression = `\\$\{${name}\}`
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

yargs
  .help()
  .scriptName(fs.basename(__filename, false))
  .command<Interpolate>('replace [filenames..]', 'replaces environment variables in a file(s)', {
    builder: {
      cwd: {
        default: process.cwd(),
      },
      destination: {
        default: process.cwd(),
      },
      lineEndings: {
        choices: ['crlf', 'lf', 'ignore'],
        default: 'ignore',
      },
      json: {
        boolean: true,
        default: false,
      },
      save: {
        boolean: true,
        default: false,
      },
      output: {
        choices: [DataType.Json, DataType.Raw],
        default: DataType.Raw,
      },
    },
    handler: async args => {
      const datatype = () => (args.json ? DataType.Json : args.output)

      const filenames = await files(args.cwd, args.filenames)

      const renderers = await Promise.all(
        filenames
          .map(filepath => ({ filepath, buffer: fs.readFile(filepath) }))
          .map<Promise<Interpolated>>(async fileinfo => {
            const buffer = await fileinfo.buffer
            const interpolated = interpolate(process.env, buffer.toString())
            if (args.save) {
              const destination = fs.join(args.destination, fs.basename(fileinfo.filepath))
              await fs.writeFile(destination, interpolated)
            }

            return {
              filename: fileinfo.filepath,
              rendered: interpolated,
            }
          }),
      )

      renderers.map(renderer => {
        const dt = datatype()
        switch (dt) {
          case DataType.Json:
            process.stdout.write(JSON.stringify(renderer))
            process.stdout.write('\n')
            break

          default:
            process.stdout.write(renderer.rendered)
            process.stdout.write('\n')
            break
        }
      })
    },
  })
  .parse()
