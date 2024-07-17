import InvoiceItemModel from '@/modules/invoice/repository/invoice-item.model'
import { Column, HasMany, Model, PrimaryKey, Table } from 'sequelize-typescript'

@Table({
  tableName: 'invoices',
  timestamps: false,
})
export class InvoiceModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  declare id: string

  @Column({ allowNull: false, field: 'created_at' })
  declare createdAt: Date

  @Column({ allowNull: false, field: 'updated_at' })
  declare updatedAt: Date

  @Column({ allowNull: false })
  declare name: string

  @Column({ allowNull: false })
  declare document: string

  @Column({ allowNull: false })
  declare street: string

  @Column({ allowNull: false })
  declare number: string

  @Column({ allowNull: false })
  declare complement: string

  @Column({ allowNull: false })
  declare city: string

  @Column({ allowNull: false })
  declare state: string

  @Column({ allowNull: false,  })
  declare zipcode: string

  @HasMany(() => InvoiceItemModel)
  declare items: InvoiceItemModel[]

  @Column({ allowNull: false })
  declare total: number
}
