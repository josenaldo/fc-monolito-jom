import { AggregateRoot } from '@/modules/@shared/domain/entity/aggregate-root.interface'
import { BaseEntity } from '@/modules/@shared/domain/entity/base.entity'
import { Address } from '@/modules/@shared/domain/value-object/address'
import { Id } from '@/modules/@shared/domain/value-object/id.value-object'

export type ClientProps = {
  id?: Id
  createdAt?: Date
  updatedAt?: Date
  name: string
  email: string
  document: string
  address: Address
}

export class Client extends BaseEntity implements AggregateRoot {
  private _name: string
  private _email: string
  private _document: string
  private _address: Address

  constructor(props: ClientProps) {
    super(props.id, props.createdAt, props.updatedAt)
    this._name = props.name
    this._email = props.email
    this._document = props.document

    if (props.address) {
      this._address = new Address({
        street: props.address.street,
        number: props.address.number,
        complement: props.address.complement,
        city: props.address.city,
        state: props.address.state,
        zipCode: props.address.zipCode,
        parentContext: this.contextName,
      })
    }
    this.validate()
  }

  get contextName(): string {
    return 'client-adm/client'
  }

  get name(): string {
    return this._name
  }

  get email(): string {
    return this._email
  }

  get document(): string {
    return this._document
  }

  get address(): Address {
    return this._address
  }

  validate(): void {
    if (!this._name) {
      this.addNotificationError('Name is required')
    }

    if (!this._email) {
      this.addNotificationError('Email is required')
    }

    if (!this._document) {
      this.addNotificationError('Document is required')
    }

    if (!this._address) {
      this.addNotificationError('Address is required')
    } else {
      this._address.validate()
    }

    if (this._email && !this._email.includes('@')) {
      this.addNotificationError('Invalid email')
    }

    this.throwIfHasNotificationErrors()
  }
}
