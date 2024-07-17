import { Migrator } from '@/modules/@shared/test/migrator'
import { CheckoutGateway } from '@/modules/checkout/gateway/checkout.gateway'
import { ClientModel as CheckoutClientModel } from '@/modules/checkout/repository/client.model'
import OrderItemModel from '@/modules/checkout/repository/order-item.model'
import { OrderModel } from '@/modules/checkout/repository/order.model'
import { ClientAdmFacadeInterface } from '@/modules/client-adm/facade/client-adm.facade.interface'
import { ClientModel as ClientAdmClientModel } from '@/modules/client-adm/repository/client.model'
import { InvoiceFacadeInterface } from '@/modules/invoice/facade/invoice.facade.interface'
import InvoiceItemModel from '@/modules/invoice/repository/invoice-item.model'
import { InvoiceModel } from '@/modules/invoice/repository/invoice.model'
import { PaymentFacadeInterface } from '@/modules/payment/facade/payment.facade.interface'
import { TransactionModel } from '@/modules/payment/repository/transaction.model'
import { ProductAdmFacadeInterface } from '@/modules/product-adm/facade/product-adm.facade.interface'
import { ProductModel as AdmProductModel } from '@/modules/product-adm/repository/product.model'
import { StoreCatalogFacadeInterface } from '@/modules/store-catalog/facade/store-catalog.facade.interface'
import { ProductModel as StoreCatalogProductModel } from '@/modules/store-catalog/repository/product.model'

export function CreateMigrator(): Migrator {
  return new Migrator([
    OrderModel,
    OrderItemModel,
    CheckoutClientModel,
    ClientAdmClientModel,
    StoreCatalogProductModel,
    AdmProductModel,
    TransactionModel,
    InvoiceModel,
    InvoiceItemModel,
  ])
}

export function CreateMockRepository(): CheckoutGateway {
  return {
    add: jest.fn(),
    find: jest.fn(),
  }
}

export function CreateMockClientFacade(): ClientAdmFacadeInterface {
  return {
    findClient: jest.fn(),
    addClient: jest.fn(),
  }
}

export function CreateMockProductFacade(): ProductAdmFacadeInterface {
  return {
    findProduct: jest.fn(),
    addProduct: jest.fn(),
    checkStock: jest.fn(),
  }
}

export function CreateMockStoreCatalogFacade(): StoreCatalogFacadeInterface {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
  }
}

export function CreateMockPaymentFacade(): PaymentFacadeInterface {
  return {
    process: jest.fn(),
  }
}

export function CreateMockInvoiceFacade(): InvoiceFacadeInterface {
  return {
    create: jest.fn(),
    find: jest.fn(),
  }
}
