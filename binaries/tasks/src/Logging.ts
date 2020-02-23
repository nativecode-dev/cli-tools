import { createLogger } from '@nnode/lincoln'
import { LincolnLogDebug } from '@nnode/lincoln-debug'

const lincoln = createLogger('tasks')
export const Debug = new LincolnLogDebug(lincoln)
export const Logger = lincoln
