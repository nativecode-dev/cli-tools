import os from 'os'

export function formatTable<T>(data: T, stdout: NodeJS.WriteStream, stderr: NodeJS.WriteStream) {
  stdout.write(JSON.stringify(data))
  return stdout.write(os.EOL)
}
