import { Migrator } from '@/modules/@shared/test/migrator'
import { ProductGateway } from '@/modules/store-catalog/gateway/product.gateway'
import { ProductModel } from '@/modules/store-catalog/repository/product.model'

export function CreateMigrator(): Migrator {
  return new Migrator({ models: [ProductModel] })
}

export function CreateMockRepository(): ProductGateway {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
  }
}
