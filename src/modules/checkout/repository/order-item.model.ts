import { OrderModel } from '@/modules/checkout/repository/order.model'
import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript'

@Table({
  tableName: 'order_items',
  timestamps: false,
})
export default class OrderItemModel extends Model {
  @PrimaryKey
  @Column
  declare id: string

  @Column({ allowNull: false, field: 'created_at' })
  declare createdAt: Date

  @Column({ allowNull: false, field: 'updated_at' })
  declare updatedAt: Date

  @ForeignKey(() => OrderModel)
  @Column({ allowNull: false, field: 'order_id' })
  declare orderId: string

  @BelongsTo(() => OrderModel)
  declare order: ReturnType<() => OrderModel>

  @Column({ allowNull: false, field: 'product_id' })
  declare productId: string

  @Column({ allowNull: false })
  declare quantity: number

  @Column({ allowNull: false })
  declare price: number

  @Column({ allowNull: false })
  declare total: number
}
