import { TestUtils } from '@/modules/@shared/test/test.utils'
import { ClientGateway } from '@/modules/client-adm/gateway/client.gateway'
import { ClientModel } from '@/modules/client-adm/repository/client.model'
import { Sequelize } from 'sequelize-typescript'

export async function InitSequelizeForClientAdmModule(): Promise<Sequelize> {
  return await TestUtils.CreateSequelizeWithModels([ClientModel])
}

export function CreateMockRepository(): ClientGateway {
  return {
    find: jest.fn(),
    add: jest.fn(),
  }
}
