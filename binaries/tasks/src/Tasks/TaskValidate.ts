import { fs } from '@nofrills/fs'
import { validate } from 'jsonschema'

const schema = require('../Schemas/task-schema.json')

const SCHEMA_PATH = fs.join(__dirname, '../', 'Schemas', 'task-schema.json')

export async function taskValidate(filename: string): Promise<boolean> {
  if ((await fs.exists(filename)) === false) {
    return false
  }

  const json = await fs.json<any>(filename)
  return taskValidateConfig(json)
}

export async function taskValidateConfig(json: any): Promise<boolean> {
  if ((await fs.exists(SCHEMA_PATH)) === false) {
    throw new Error(`could not find schema: ${SCHEMA_PATH}`)
  }

  const result = validate(json, schema)
  return result.valid
}
