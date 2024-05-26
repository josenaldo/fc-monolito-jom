import { ValueObject } from '@/modules/@shared/domain/value-object/value-object.interface'
import { v4 as uuidv4, validate as validateId } from 'uuid'

export class Id implements ValueObject {
  private _value: string

  constructor(value?: string) {
    this._value = value || uuidv4()

    if (!validateId(this._value)) {
      throw new Error('Invalid id')
    }
  }

  get value(): string {
    return this._value
  }
}
