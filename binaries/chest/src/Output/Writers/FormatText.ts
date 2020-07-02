import { is_type, NativeTypes, is_type_oneof } from '../../Functions/IsType'

const spaces = (count: number, separator: string = ' '): string =>
  Array(count)
    .map((_) => separator)
    .join(separator)

function write(buffer: string | Uint8Array, stream: NodeJS.WriteStream, newline: boolean = false) {
  stream.write(buffer)

  if (newline) {
    stream.write('\n')
  }
}

function formatSimpleText(value: any, stream: NodeJS.WriteStream, level: number = 0): any {
  if (is_type(value, NativeTypes.array)) {
    const array: any[] = value
    return array.map((item) => formatSimpleText(item, stream, level + 1))
  }

  if (is_type(value, NativeTypes.object)) {
    return Object.keys(value).map((key) => formatSimpleText(value[key], stream, level + 1))
  }

  if (is_type_oneof(value, [NativeTypes.number, NativeTypes.string])) {
    if (level % 2 === 0) {
      write(spaces(level) + '├', stream)
    }
    write(spaces(level * 2), stream)
    return write(value, stream, true)
  }
}

export function formatText<T>(data: T, stdout: NodeJS.WriteStream, stderr: NodeJS.WriteStream) {
  formatSimpleText(data, stdout)
  formatSimpleText(spaces(stdout.columns, '-'), stdout)
}
