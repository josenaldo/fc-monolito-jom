import { AggregateRoot } from '@/modules/@shared/domain/entity/aggregate-root.interface'
import { BaseEntity } from '@/modules/@shared/domain/entity/base.entity'
import { Id } from '@/modules/@shared/domain/value-object/id.value-object'

type ProductProps = {
  id?: Id
  createdAt?: Date
  updatedAt?: Date
  name: string
  description: string
  purchasePrice: number
  stock: number
}

export class Product extends BaseEntity implements AggregateRoot {
  private _name: string
  private _description: string
  private _purchasePrice: number
  private _stock: number

  constructor(props: ProductProps) {
    super(props.id, props.createdAt, props.updatedAt)
    this._name = props.name
    this._description = props.description
    this._purchasePrice = props.purchasePrice
    this._stock = props.stock
    this.validate()
  }

  get contextName(): string {
    return 'Product'
  }

  get name(): string {
    return this._name
  }

  get description(): string {
    return this._description
  }

  get purchasePrice(): number {
    return this._purchasePrice
  }

  get stock(): number {
    return this._stock
  }

  set name(name: string) {
    this._name = name
  }

  set description(description: string) {
    this._description = description
  }

  set purchasePrice(purchasePrice: number) {
    this._purchasePrice = purchasePrice
  }

  set stock(stock: number) {
    this._stock = stock
  }

  validate(): void {
    if (!this._name) {
      this.addNotificationError('Name is required')
    }

    if (!this._description) {
      this.addNotificationError('Description is required')
    }

    if (this._purchasePrice < 0) {
      this.addNotificationError(
        'Purchase price must be greater than or equal to 0'
      )
    }

    if (this._stock < 0) {
      this.addNotificationError('Stock must be greater than or equal to 0')
    }

    this.throwIfHasNotificationErrors()
  }
}
