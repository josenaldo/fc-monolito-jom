import { TestUtils } from '@/modules/@shared/test/test.utils'
import { CheckoutGateway } from '@/modules/checkout/gateway/checkout.gateway'
import { ClientAdmFacadeInterface } from '@/modules/client-adm/facade/client-adm.facade.interface'
import { InvoiceFacadeInterface } from '@/modules/invoice/facade/invoice.facade.interface'
import { PaymentFacadeInterface } from '@/modules/payment/facade/payment.facade.interface'
import { ProductAdmFacadeInterface } from '@/modules/product-adm/facade/product-adm.facade.interface'
import { StoreCatalogFacadeInterface } from '@/modules/store-catalog/facade/store-catalog.facade.interface'
import { Sequelize } from 'sequelize-typescript'

export async function InitSequelizeForCheckoutModule(): Promise<Sequelize> {
  return await TestUtils.CreateSequelizeWithModels([])
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
    generateInvoice: jest.fn(),
    findInvoice: jest.fn(),
  }
}
