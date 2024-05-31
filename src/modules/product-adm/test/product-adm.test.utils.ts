import { TestUtils } from '@/modules/@shared/test/test.utils'
import { ProductGateway } from '@/modules/product-adm/gateway/product.gateway'
import { ProductModel } from '@/modules/product-adm/repository/product.model'
import { Sequelize } from 'sequelize-typescript'

export async function InitSequelizeForProductAdmModule(): Promise<Sequelize> {
  return await TestUtils.CreateSequelizeWithModels([ProductModel])
}

export function CreateMockRepository(): ProductGateway {
  return {
    find: jest.fn(),
    add: jest.fn(),
  }
}
