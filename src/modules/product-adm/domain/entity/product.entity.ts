import { AggregateRoot } from '@/modules/@shared/domain/entity/aggregate-root.interface'
import { BaseEntity } from '@/modules/@shared/domain/entity/base.entity'
import { Id } from '@/modules/@shared/domain/value-object/id.value-object'

export type ProductProps = {
  id?: Id
  createdAt?: Date
  updatedAt?: Date
  name: string
  description: string
  purchasePrice: number
  salesPrice: number
  stock: number
}

export class Product extends BaseEntity implements AggregateRoot {
  private _name: string
  private _description: string
  private _purchasePrice: number
  private _salesPrice: number
  private _stock: number

  constructor(props: ProductProps) {
    super(props.id, props.createdAt, props.updatedAt)
    this._name = props.name
    this._description = props.description
    this._purchasePrice = props.purchasePrice
    this._salesPrice = props.salesPrice
    this._stock = props.stock
    this.validate()
  }

  get contextName(): string {
    return 'product-adm/product'
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

  get salesPrice(): number {
    return this._salesPrice
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

  set salesPrice(salesPrice: number) {
    this._salesPrice = salesPrice
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

    if (this._purchasePrice <= 0) {
      this.addNotificationError(
        'Purchase Price must be greater than or equal to 0'
      )
    }

    if (this._salesPrice <= 0) {
      this.addNotificationError('Sales Price must be greater than 0')
    }

    if (this._stock < 0) {
      this.addNotificationError('Stock must be greater than 0')
    }

    this.throwIfHasNotificationErrors()
  }
}
