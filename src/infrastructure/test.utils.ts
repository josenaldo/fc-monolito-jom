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

export function CreateE2EMigrator(): Migrator {
  return new Migrator({
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
  })
}
