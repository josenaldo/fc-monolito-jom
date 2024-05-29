import { ClientGateway } from '@/modules/client-adm/gateway/client.gateway'
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

export function CreateMockRepository(): ClientGateway {
  return {
    find: jest.fn(),
    add: jest.fn(),
  }
}
