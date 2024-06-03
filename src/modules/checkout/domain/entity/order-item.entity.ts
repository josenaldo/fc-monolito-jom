import { BaseEntity } from '@/modules/@shared/domain/entity/base.entity'
import { Id } from '@/modules/@shared/domain/value-object/id.value-object'

export type OrderItemProps = {
  id?: Id
  createdAt?: Date
  updatedAt?: Date
  productId: string
  quantity: number
  price: number
}

export class OrderItem extends BaseEntity {
  private _productId: string
  private _quantity: number
  private _price: number

  constructor(props: OrderItemProps) {
    super(props.id, props.createdAt, props.updatedAt)
    this._productId = props.productId
    this._quantity = props.quantity
    this._price = props.price
    this.validate()
  }

  get contextName(): string {
    return 'checkout/order-item'
  }

  get productId(): string {
    return this._productId
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
    if (!this._productId) {
      this.addNotificationError('Product is required')
    }

    if (this._quantity <= 0) {
      this.addNotificationError('Quantity must be greater than zero')
    }

    if (this._price <= 0) {
      this.addNotificationError('Price must be greater than zero')
    }

    this.throwIfHasNotificationErrors()
  }
}
