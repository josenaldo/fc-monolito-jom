import { Migrator } from '@/modules/@shared/test/migrator'
import { InvoiceGateway } from '@/modules/invoice/gateway/invoice.gateway'
import InvoiceItemModel from '@/modules/invoice/repository/invoice-item.model'
import { InvoiceModel } from '@/modules/invoice/repository/invoice.model'

export function CreateMigrator(): Migrator {
  return new Migrator({ models: [InvoiceModel, InvoiceItemModel] })
}

export function CreateMockRepository(): InvoiceGateway {
  return {
    save: jest.fn(),
    find: jest.fn(),
  }
}
