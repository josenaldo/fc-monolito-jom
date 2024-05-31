import { Column, Model, PrimaryKey, Table } from 'sequelize-typescript'

@Table({
  tableName: 'clients',
  timestamps: false,
})
export class ClientModel extends Model {
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
  declare email: string

  @Column({ allowNull: false })
  declare address: string
}
