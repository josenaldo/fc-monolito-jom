import { ProductGateway } from '@/modules/store-catalog/gateway/product.gateway'
import { Model, ModelCtor, Sequelize } from 'sequelize-typescript'

export function CreateSequelize(): Sequelize {
  return new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false,
    sync: {
      force: true,
    },
  })
}

export async function CreateSequelizeWithModels(
  models: ModelCtor<Model>[]
): Promise<Sequelize> {
  const sequelize = CreateSequelize()
  sequelize.addModels(models)
  await sequelize.sync()
  return sequelize
}

export function CreateMockRepository(): ProductGateway {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
  }
}
