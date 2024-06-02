import { TestUtils } from '@/modules/@shared/test/test.utils'
import { InvoiceGateway } from '@/modules/invoice/gateway/invoice.gateway'
import InvoiceItemModel from '@/modules/invoice/repository/invoice-item.model'
import { InvoiceModel } from '@/modules/invoice/repository/invoice.model'
import { Sequelize } from 'sequelize-typescript'

export async function InitSequelizeForInvoiceModule(): Promise<Sequelize> {
  return await TestUtils.CreateSequelizeWithModels([
    InvoiceModel,
    InvoiceItemModel,
  ])
}

export function CreateMockRepository(): InvoiceGateway {
  return {
    save: jest.fn(),
    find: jest.fn(),
  }
}
