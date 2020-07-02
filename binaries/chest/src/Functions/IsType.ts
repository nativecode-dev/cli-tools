export enum NativeTypes {
  array = 'Array',
  bigint = 'bigint',
  date = 'Date',
  function = 'function',
  object = 'object',
  number = 'number',
  undefined = 'undefined',
  string = 'string',
  symbol = 'symbol',
}

export function is_type_oneof(instance: any, types: NativeTypes[]): boolean {
  return types.some((type) => is_type(instance, type))
}

export function is_type(instance: any, type: NativeTypes): boolean {
  switch (type) {
    case NativeTypes.array:
      return instance.__proto__.constructor.name === NativeTypes.array

    case NativeTypes.date:
      return instance.__proto__.constructor.name === NativeTypes.date

    case NativeTypes.function:
      return typeof instance === NativeTypes.function

    case NativeTypes.number:
      return typeof instance === NativeTypes.number

    case NativeTypes.object:
      return typeof instance === NativeTypes.object

    case NativeTypes.string:
      return typeof instance === NativeTypes.string

    case NativeTypes.symbol:
      return typeof instance === NativeTypes.symbol

    case NativeTypes.undefined:
      return typeof instance === NativeTypes.undefined

    default:
      return false
  }
}
