import { AggregateRoot } from '@/modules/@shared/domain/entity/aggregate-root.interface'
import { BaseEntity } from '@/modules/@shared/domain/entity/base.entity'
import { Id } from '@/modules/@shared/domain/value-object/id.value-object'

type ProductProps = {
  // O id deve ser obrigatório pois esse produto sempre representa um produto que já existe
  id: Id
  name: string
  description: string
  salesPrice: number
  createdAt: Date
  updatedAt: Date
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
  }

  get contextName(): string {
    return 'store-catalog/product'
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
}
