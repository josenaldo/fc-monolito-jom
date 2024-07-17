import { Migrator } from '@/modules/@shared/test/migrator'
import { ClientGateway } from '@/modules/client-adm/gateway/client.gateway'
import { ClientModel } from '@/modules/client-adm/repository/client.model'

export function CreateMigrator(): Migrator {
  return new Migrator([ClientModel])
}

export function CreateMockRepository(): ClientGateway {
  return {
    find: jest.fn(),
    add: jest.fn(),
  }
}
