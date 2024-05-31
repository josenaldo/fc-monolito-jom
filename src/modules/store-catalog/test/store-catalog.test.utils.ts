import { TestUtils } from '@/modules/@shared/test/test.utils'
import { ProductGateway } from '@/modules/store-catalog/gateway/product.gateway'
import { ProductModel } from '@/modules/store-catalog/repository/product.model'
import { Sequelize } from 'sequelize-typescript'

export async function InitSequelizeForStoreCatalogModule(): Promise<Sequelize> {
  return await TestUtils.CreateSequelizeWithModels([ProductModel])
}

export function CreateMockRepository(): ProductGateway {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
  }
}
