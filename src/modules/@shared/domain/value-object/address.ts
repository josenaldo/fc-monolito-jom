import { BaseValueObject } from '@/modules/@shared/domain/value-object/base.value-object'

export type AddressProps = {
  street: string
  number: string
  complement?: string
  city: string
  state: string
  zipCode: string
  parentContext?: string
}

export class Address extends BaseValueObject {
  private _street: string = ''
  private _number: string = ''
  private _complement?: string
  private _city: string = ''
  private _state: string = ''
  private _zipCode: string = ''

  constructor(props: AddressProps) {
    super(props.parentContext)
    this._street = props.street
    this._number = props.number
    this._complement = props.complement
    this._city = props.city
    this._state = props.state
    this._zipCode = props.zipCode

    this.validate()
  }

  get contextName(): string {
    return 'address'
  }

  get street() {
    return this._street
  }

  get number() {
    return this._number
  }

  get complement() {
    return this._complement
  }

  get city() {
    return this._city
  }

  get state() {
    return this._state
  }

  get zipCode() {
    return this._zipCode
  }

  toString() {
    return `${this._street}, ${this._number}, ${this._complement} - ${this._city}/${this._state} - ${this._zipCode}`
  }

  validate() {
    if (!this._street) {
      this.addNotificationError('Street is required')
    }

    if (!this._number) {
      this.addNotificationError('Number is required')
    }

    if (!this._city) {
      this.addNotificationError('City is required')
    }

    if (!this._state) {
      this.addNotificationError('State is required')
    }

    if (!this._zipCode) {
      this.addNotificationError('Zip code is required')
    }

    this.throwIfHasNotificationErrors()
  }
}
