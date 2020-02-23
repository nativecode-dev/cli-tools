import { fs } from '@nofrills/fs'

export class Shebang {
  static from(cwd: string): Promise<void> {
    return new Shebang().shebang(cwd)
  }

  async shebang(cwd: string): Promise<void> {
    const filename = fs.join(cwd, 'package.json')
    const npm = await fs.json<any>(filename)

    if (typeof npm.bin === 'string') {
      await Shebang.shebangify(fs.basename(npm.bin, false), npm.bin)
    }

    if (typeof npm.bin === 'object') {
      const bin: any = npm.bin

      await Promise.all(
        Object.keys(bin).map(async key => {
          try {
            return await Shebang.shebangify(key, fs.join(process.cwd(), bin[key]))
          } catch (error) {
            throw error
          }
        }),
      )
    }
  }

  static async shebangify(name: string, filename: string): Promise<Buffer> {
    try {
      const original = await fs.readFile(filename)

      if (original.toString().startsWith('#!') === false) {
        const shebang = Buffer.from('#!/usr/bin/env node\n')
        const combined = Buffer.concat([shebang, original])
        await fs.writeFile(filename, combined)
        return combined
      }

      return original
    } catch (error) {
      throw error
    }
  }
}
