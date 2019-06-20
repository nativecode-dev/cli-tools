export { Lincoln } from '@nofrills/lincoln-debug'
import { ScrubsInterceptor } from '@nofrills/scrubs'
import { CreateLogger, CreateOptions, Lincoln, Options } from '@nofrills/lincoln-debug'

const LoggerOptions: Options = CreateOptions('nofrills:tasks')
LoggerOptions.interceptors.register('scrubs', ScrubsInterceptor)
export const Logger: Lincoln = CreateLogger(LoggerOptions)
