import { Log, LogMessageType } from '@nofrills/lincoln'
import { CreateLogger, CreateOptions } from '@nofrills/lincoln-console'

const options = CreateOptions('nativecode:clam')
const Logger = CreateLogger(options)

const map: { [key: string]: number } = { none: 0 }

map[LogMessageType.info] = 1
map[LogMessageType.silly] = 2
map[LogMessageType.debug] = 3
map[LogMessageType.warn] = 4
map[LogMessageType.error] = 5
map[LogMessageType.fatal] = 6
map[LogMessageType.trace] = 7

export function SetLogLevel(loglevel: LogMessageType): void {
  options.filters.register('log-level', (log: Log) => {
    const requested = map[loglevel]
    const current = map[log.type]
    return Promise.resolve(requested > current)
  })
}

export default Logger
