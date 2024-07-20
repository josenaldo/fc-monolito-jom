import { Migrator } from '@/modules/@shared/test/migrator'
import { ProductGateway } from '@/modules/product-adm/gateway/product.gateway'
import { ProductModel } from '@/modules/product-adm/repository/product.model'

export function CreateMigrator(): Migrator {
  return new Migrator({ models: [ProductModel] })
}

export function CreateMockRepository(): ProductGateway {
  return {
    find: jest.fn(),
    add: jest.fn(),
  }
}
