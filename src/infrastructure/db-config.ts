import { Migrator } from '@/modules/@shared/test/migrator'
import { ClientModel as CheckoutClientModel } from '@/modules/checkout/repository/client.model'
import OrderItemModel from '@/modules/checkout/repository/order-item.model'
import { OrderModel } from '@/modules/checkout/repository/order.model'
import { ClientModel as ClientAdmClientModel } from '@/modules/client-adm/repository/client.model'
import InvoiceItemModel from '@/modules/invoice/repository/invoice-item.model'
import { InvoiceModel } from '@/modules/invoice/repository/invoice.model'
import { TransactionModel } from '@/modules/payment/repository/transaction.model'
import { ProductModel as AdmProductModel } from '@/modules/product-adm/repository/product.model'
import { ProductModel as StoreCatalogProductModel } from '@/modules/store-catalog/repository/product.model'
import { dirname, join } from 'path'
import { Sequelize } from 'sequelize-typescript'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const migrationsParentFolder = join(__dirname, '..')

const sequelize: Sequelize = new Sequelize({
  dialect: 'sqlite',
  // storage: ':memory:',
  storage: './db.sqlite',
  logging: false,
})

export const migrator: Migrator = new Migrator({
  models: [
    OrderModel,
    OrderItemModel,
    CheckoutClientModel,
    ClientAdmClientModel,
    StoreCatalogProductModel,
    AdmProductModel,
    TransactionModel,
    InvoiceModel,
    InvoiceItemModel,
  ],
  sequelize,
  migrationsParentFolder: migrationsParentFolder,
})
