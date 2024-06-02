import { AggregateRoot } from '@/modules/@shared/domain/entity/aggregate-root.interface'
import { BaseEntity } from '@/modules/@shared/domain/entity/base.entity'
import { Id } from '@/modules/@shared/domain/value-object/id.value-object'

export type ProductProps = {
  id?: Id
  createdAt?: Date
  updatedAt?: Date
  name: string
  description: string
  salesPrice: number
}

export class Product extends BaseEntity implements AggregateRoot {
  private _name: string
  private _description: string
  private _salesPrice: number

  constructor(props: ProductProps) {
    super(props.id, props.createdAt, props.updatedAt)
    this._name = props.name
    this._description = props.description
    this._salesPrice = props.salesPrice
    this.validate()
  }

  get contextName(): string {
    return 'checkout/product'
  }

  get name(): string {
    return this._name
  }

  get description(): string {
    return this._description
  }

  get salesPrice(): number {
    return this._salesPrice
  }

  validate(): void {
    if (!this._name) {
      this.addNotificationError('Name is required')
    }

    if (!this._description) {
      this.addNotificationError('Description is required')
    }

    if (!this._salesPrice) {
      this.addNotificationError('Price is required')
    }

    if (this._salesPrice && this._salesPrice <= 0) {
      this.addNotificationError('Sales Price must be greater than zero')
    }

    this.throwIfHasNotificationErrors()
  }
}
