export interface CashCallback<T> {
  (instance: T): T
}

export interface Cash<T> {
  after(callback: Function): T
}

export class CashInstance<T> implements Cash<T> {
  constructor(protected readonly instance: T) {}

  after(callback: CashCallback<T>): T {
    return callback(this.instance)
  }
}

export default function $<T>(instance: T): Cash<T> {
  return new CashInstance(instance)
}
