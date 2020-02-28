import { fs } from '@nofrills/fs'
import { validate } from 'jsonschema'

const schema = require('../Schemas/task-schema.json')

export async function taskValidate(json: any): Promise<boolean> {
  const result = validate(json, schema)
  return result.valid
}

export async function taskValidateFile(filename: string): Promise<boolean> {
  if ((await fs.exists(filename)) === false) {
    return false
  }

  const json = await fs.json<any>(filename)
  return taskValidate(json)
}
