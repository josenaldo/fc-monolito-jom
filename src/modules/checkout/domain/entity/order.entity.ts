import { AggregateRoot } from '@/modules/@shared/domain/entity/aggregate-root.interface'
import { BaseEntity } from '@/modules/@shared/domain/entity/base.entity'
import { Id } from '@/modules/@shared/domain/value-object/id.value-object'
import { Client } from '@/modules/checkout/domain/entity/client.entity'
import { OrderItem } from '@/modules/checkout/domain/entity/order-item.entity'

export enum OrderStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  CANCELLED = 'cancelled',
}

export type OrderProps = {
  id?: Id
  createdAt?: Date
  updatedAt?: Date
  client: Client
  items: OrderItem[]
  status?: OrderStatus
}

export class Order extends BaseEntity implements AggregateRoot {
  private _client: Client
  private _items: OrderItem[]
  private _status: OrderStatus

  constructor(props: OrderProps) {
    super(props.id, props.createdAt, props.updatedAt)
    this._client = props.client
    this._items = props.items
    this._status = props.status || OrderStatus.PENDING
    this.validate()
  }

  get contextName(): string {
    return 'checkout/order'
  }

  get client(): Client {
    return this._client
  }

  get items(): OrderItem[] {
    return this._items
  }

  get status(): OrderStatus {
    return this._status
  }

  get total(): number {
    return this._items && this.items.length > 0
      ? this._items.reduce((acc, item) => acc + item.total, 0)
      : 0
  }

  validate(): void {
    if (!this._client) {
      this.addNotificationError('Client is required')
    }

    if (!this._items || this._items.length === 0) {
      this.addNotificationError('Items are required')
    }

    if (!this._status) {
      this.addNotificationError('Status is required')
    }

    this.throwIfHasNotificationErrors()
  }

  approve(): void {
    if (this._status === OrderStatus.APPROVED) {
      this.addNotificationError('Order already approved')
    }

    if (this._status === OrderStatus.CANCELLED) {
      this.addNotificationError('Order already cancelled')
    }

    this.throwIfHasNotificationErrors()

    this._status = OrderStatus.APPROVED
  }

  cancel(): void {
    if (this._status === OrderStatus.CANCELLED) {
      this.addNotificationError('Order already cancelled')
    }

    if (this._status === OrderStatus.APPROVED) {
      this.addNotificationError('Order already approved')
    }

    this.throwIfHasNotificationErrors()

    this._status = OrderStatus.CANCELLED
  }
}
