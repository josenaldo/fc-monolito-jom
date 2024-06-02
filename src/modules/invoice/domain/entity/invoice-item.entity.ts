import { AggregateRoot } from '@/modules/@shared/domain/entity/aggregate-root.interface'
import { BaseEntity } from '@/modules/@shared/domain/entity/base.entity'
import { Id } from '@/modules/@shared/domain/value-object/id.value-object'

export type InvoiceItemProps = {
  id?: Id
  createdAt?: Date
  updatedAt?: Date
  name: string
  price: number
  quantity: number
}

export class InvoiceItem extends BaseEntity implements AggregateRoot {
  private _name: string
  private _price: number
  private _quantity: number

  constructor(props: InvoiceItemProps) {
    super(props.id, props.createdAt, props.updatedAt)
    this._name = props.name
    this._price = props.price
    this._quantity = props.quantity
    this.validate()
  }

  get contextName(): string {
    return 'invoice/invoice-item'
  }

  get name(): string {
    return this._name
  }

  get quantity(): number {
    return this._quantity
  }

  get price(): number {
    return this._price
  }

  get total(): number {
    return this._price * this._quantity
  }

  validate(): void {
    if (!this._name) {
      this.addNotificationError('Name is required')
    }

    if (this._price <= 0) {
      this.addNotificationError('Price must be greater than 0')
    }

    if (this._quantity <= 0) {
      this.addNotificationError('Quantity must be greater than 0')
    }

    this.throwIfHasNotificationErrors()
  }
}
