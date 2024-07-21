import { ClientModel } from '@/modules/checkout/repository/client.model'
import OrderItemModel from '@/modules/checkout/repository/order-item.model'
import {
  BelongsTo,
  Column,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript'

@Table({
  tableName: 'orders',
  timestamps: false,
})
export class OrderModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  declare id: string

  @Column({ allowNull: false, field: 'created_at' })
  declare createdAt: Date

  @Column({ allowNull: false, field: 'updated_at' })
  declare updatedAt: Date

  @Column({ allowNull: false })
  declare status: string

  @Column({ allowNull: false })
  declare total: number

  @ForeignKey(() => ClientModel)
  @Column({ allowNull: false, field: 'client_id' })
  declare clientId: string

  @BelongsTo(() => ClientModel, { as: 'client' })
  declare client: ReturnType<() => ClientModel>

  @HasMany(() => OrderItemModel, { as: 'items' })
  declare items: OrderItemModel[]
}
