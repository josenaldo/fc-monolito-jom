import { BaseValueObject } from '@/modules/@shared/domain/value-object/base.value-object'

export type AddressProps = {
  street: string
  number: string
  complement?: string
  zipCode: string
  city: string
  state: string
}

export default class Address extends BaseValueObject {
  private _street: string = ''
  private _number: string = ''
  private _complement?: string
  private _zipCode: string = ''
  private _city: string = ''
  private _state: string = ''

  constructor(props: AddressProps) {
    super()
    this._street = props.street
    this._number = props.number
    this._complement = props.complement
    this._zipCode = props.zipCode
    this._city = props.city
    this._state = props.state

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

  get zipCode() {
    return this._zipCode
  }

  get city() {
    return this._city
  }

  get state() {
    return this._state
  }

  toString() {
    return `${this._street}, ${this._number} - ${this._city}/${this._state} - ${this._zipCode} - ${this._complement}`
  }

  validate() {
    if (!this._street) {
      this.addNotificationError('Street is required')
    }

    if (!this._number) {
      this.addNotificationError('Number is required')
    }

    if (!this._zipCode) {
      this.addNotificationError('Zip code is required')
    }

    if (!this._city) {
      this.addNotificationError('City is required')
    }

    if (!this._state) {
      this.addNotificationError('State is required')
    }

    this.throwIfHasNotificationErrors()
  }
}
