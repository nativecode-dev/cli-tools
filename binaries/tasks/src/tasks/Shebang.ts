import { fs } from '@nofrills/fs'
import { Is, Npm, DictionaryOf } from '@nofrills/types'

import Logger from '../Logging'

export class Shebang {
  private readonly log = Logger.extend('shebang')
  private readonly npm: Promise<Npm>

  protected constructor(npm: string) {
    this.log.debug('npm', npm)
    this.npm = fs.json<Npm>(npm)
  }

  static from(npm: string): Shebang {
    return new Shebang(npm)
  }

  async shebang(): Promise<void> {
    const npm = await this.npm

    if (Is.string(npm.bin)) {
      this.log.debug('bin', npm.bin)
      await Shebang.shebangify(npm.bin as string)
    }

    if (npm.bin) {
      const hash: DictionaryOf<string> = npm.bin as DictionaryOf<string>

      await Promise.all(
        Object.keys(hash).map(async key => {
          this.log.debug('bin', key)
          const bin = hash[key]

          try {
            return await Shebang.shebangify(fs.join(process.cwd(), bin))
          } catch (error) {
            Logger.error(error)
          }
        }),
      )
    }
  }

  static async shebangify(filename: string): Promise<Buffer> {
    try {
      const original = await fs.readFile(filename)

      if (original.toString().startsWith('#!') === false) {
        const shebang = Buffer.from('#!/usr/bin/env node\n')
        const combined = Buffer.concat([shebang, original])
        await fs.writeFile(filename, combined)
        return combined
      }

      return original
    } catch (e) {
      Logger.error(`failed to write file: ${filename}`)
      throw e
    }
  }
}
