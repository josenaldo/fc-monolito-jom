import { AggregateRoot } from '@/modules/@shared/domain/entity/aggregate-root.interface'
import { BaseEntity } from '@/modules/@shared/domain/entity/base.entity'
import { Address } from '@/modules/@shared/domain/value-object/address'
import { Id } from '@/modules/@shared/domain/value-object/id.value-object'
import { InvoiceItem } from '@/modules/invoice/domain/entity/invoice-item.entity'

export type InvoiceProps = {
  id?: Id
  createdAt?: Date
  updatedAt?: Date
  name: string
  document: string
  address: Address
  items: InvoiceItem[]
}

export class Invoice extends BaseEntity implements AggregateRoot {
  private _name: string
  private _document: string
  private _address: Address
  private _items: InvoiceItem[]

  constructor(props: InvoiceProps) {
    super(props.id, props.createdAt, props.updatedAt)
    this._name = props.name
    this._document = props.document
    this._address = props.address
    this._items = props.items
    this.validate()
  }

  get contextName(): string {
    return 'invoice/invoice'
  }

  get name(): string {
    return this._name
  }

  get document(): string {
    return this._document
  }

  get address(): Address {
    return this._address
  }

  get items(): InvoiceItem[] {
    return this._items
  }

  get total(): number {
    return this._items.reduce((acc, item) => acc + item.total, 0)
  }

  validate(): void {
    if (!this._name) {
      this.addNotificationError('Name is required')
    }

    if (!this._document) {
      this.addNotificationError('Document is required')
    }

    if (!this._address) {
      this.addNotificationError('Address is required')
    }

    if (!this._items.length) {
      this.addNotificationError('Items is required')
    }

    this.throwIfHasNotificationErrors()
  }
}
