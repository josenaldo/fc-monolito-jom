import { AggregateRoot } from '@/modules/@shared/domain/entity/aggregate-root.interface'
import { BaseEntity } from '@/modules/@shared/domain/entity/base.entity'
import { Id } from '@/modules/@shared/domain/value-object/id.value-object'

export type ClientProps = {
  id?: Id
  createdAt?: Date
  updatedAt?: Date
  name: string
  email: string
  address: string
}

export class Client extends BaseEntity implements AggregateRoot {
  private _name: string
  private _email: string
  private _address: string

  constructor(props: ClientProps) {
    super(props.id, props.createdAt, props.updatedAt)
    this._name = props.name
    this._email = props.email
    this._address = props.address
    this.validate()
  }

  get contextName(): string {
    return 'checkout/client'
  }

  get name(): string {
    return this._name
  }

  get email(): string {
    return this._email
  }

  get address(): string {
    return this._address
  }

  validate(): void {
    if (!this._name) {
      this.addNotificationError('Name is required')
    }

    if (!this._email) {
      this.addNotificationError('Email is required')
    }

    if (!this._address) {
      this.addNotificationError('Address is required')
    }

    if (this._email && !this._email.includes('@')) {
      this.addNotificationError('Invalid email')
    }

    this.throwIfHasNotificationErrors()
  }
}
