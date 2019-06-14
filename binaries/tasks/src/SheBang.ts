import { fs } from '@nofrills/fs'
import { Is, Npm, DictionaryOf } from '@nofrills/types'

import { ConsoleLog, Lincoln, Logger } from './Logging'

export class SheBang {
  private readonly log: Lincoln = Logger.extend('shebang')
  private readonly npm: Promise<Npm>

  protected constructor(npm: string) {
    this.log.debug('npm', npm)
    this.npm = fs.json<Npm>(npm)
  }

  static from(npm: string): SheBang {
    return new SheBang(npm)
  }

  async shebang(): Promise<void> {
    const npm = await this.npm

    if (Is.string(npm.bin)) {
      this.log.debug('bin', npm.bin)
      await SheBang.shebangify(npm.bin as string)
    }

    if (npm.bin) {
      const hash: DictionaryOf<string> = npm.bin as DictionaryOf<string>

      await Promise.all(
        Object.keys(hash).map(async key => {
          this.log.debug('bin', key)
          const bin = hash[key]

          try {
            return await SheBang.shebangify(fs.join(process.cwd(), bin))
          } catch (error) {
            ConsoleLog.info(bin, error)
          }
        }),
      )
    }
  }

  static async shebangify(filename: string): Promise<Buffer> {
    try {
      ConsoleLog.info('<cli-shebang>', filename)
      const original = await fs.readFile(filename)

      if (original.toString().startsWith('#!') === false) {
        const shebang = Buffer.from('#!/usr/bin/env node\n')
        const combined = Buffer.concat([shebang, original])
        await fs.writeFile(filename, combined)
        return combined
      }

      return original
    } catch (e) {
      ConsoleLog.error(`failed to write file: ${filename}`)
      throw e
    }
  }
}
