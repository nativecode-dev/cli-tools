import { OutputType } from './OutputType'
import { formatJson } from './Writers/FormatJson'
import { formatObject } from './Writers/FormatObject'
import { formatTable } from './Writers/FormatTable'
import { formatText } from './Writers/FormatText'

export function output<T>(
  data: T,
  type: OutputType,
  stdout: NodeJS.WriteStream = process.stdout,
  stderr: NodeJS.WriteStream = process.stderr,
) {
  switch (type) {
    case OutputType.json:
      return formatJson(data, stdout, stderr)

    case OutputType.text:
      return formatText(data, stdout, stderr)

    case OutputType.table:
      return formatTable(data, stdout, stderr)

    default:
      return formatObject(data, stdout, stderr)
  }
}
