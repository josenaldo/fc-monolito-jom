import { BaseValueObject } from '@/modules/@shared/domain/value-object/base.value-object'
import { v4 as uuidv4, validate as validateId } from 'uuid'

export class Id extends BaseValueObject {
  private _value: string

  constructor(value?: string) {
    super()
    this._value = value || uuidv4()
    this.validate()
  }

  get contextName(): string {
    return 'id'
  }

  get value(): string {
    return this._value
  }

  validate(): void {
    if (!validateId(this._value)) {
      this.addNotificationError(`Invalid id: ${this._value}`)
    }

    this.throwIfHasNotificationErrors()
  }
}
