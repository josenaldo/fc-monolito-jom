import { InvoiceModel } from "@/modules/invoice/repository/invoice.model"
import { BelongsTo, Column, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript"

@Table({
  tableName: 'invoice_items',
  timestamps: false,
})
export default class InvoiceItemModel extends Model {
  @PrimaryKey
  @Column
  declare id: string

  @ForeignKey(() => InvoiceModel)
  @Column({ allowNull: false, field: 'invoice_id'})
  declare invoiceId: string

  @BelongsTo(() => InvoiceModel)
  declare invoice: ReturnType<() => InvoiceModel>

  @Column({ allowNull: false })
  declare name: string

  @Column({ allowNull: false })
  declare price: number

  @Column({ allowNull: false })
  declare quantity: number

  @Column({ allowNull: false })
  declare total: number
}