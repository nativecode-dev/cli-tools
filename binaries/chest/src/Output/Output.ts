import { OutputType } from './OutputType'
import { formatJson } from './Writers/FormatJson'
import { formatObject } from './Writers/FormatObject'
import { formatTable } from './Writers/FormatTable'
import { formatText } from './Writers/FormatText'

export function output<T>(data: T, type: OutputType) {
  switch (type) {
    case OutputType.json:
      return formatJson(data)

    case OutputType.text:
      return formatText(data)

    case OutputType.table:
      return formatTable(data)

    default:
      return formatObject(data)
  }
}
