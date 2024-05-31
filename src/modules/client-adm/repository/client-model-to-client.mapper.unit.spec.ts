import { Id } from '@/modules/@shared/domain/value-object/id.value-object'
import { Client } from '@/modules/client-adm/domain/entity/client.entity'
import { ClientModelToClientMapper } from '@/modules/client-adm/repository/client-model-to-client.mapper'
import { ClientModel } from '@/modules/client-adm/repository/client.model'
import { InitSequelizeForClientAdmModule } from '@/modules/client-adm/test/client-adm.test.utils'
import { Sequelize } from 'sequelize-typescript'

describe('ClientModelToClientMapper unit tests', () => {
  let sequelize: Sequelize

  beforeEach(async () => {
    sequelize = await InitSequelizeForClientAdmModule()
  })

  afterEach(async () => {
    await sequelize.close()
  })

  it('should map ClientModel to Client', () => {
    const id: Id = new Id()

    const clientModel: ClientModel = new ClientModel({
      id: id.value,
      createdAt: new Date(),
      updatedAt: new Date(),
      name: 'client',
      email: 'teste@teste.com',
      address: 'Rua 1, 123, Bairro 1, Cidade 1, Estado 1',
    })

    const client = ClientModelToClientMapper.toClient(clientModel)

    expect(client).toBeInstanceOf(Client)
    expect(client.id.value).toBe(id.value)
    expect(client.createdAt).toEqual(clientModel.createdAt)
    expect(client.updatedAt).toEqual(clientModel.updatedAt)
    expect(client.name).toBe(clientModel.name)
    expect(client.email).toBe(clientModel.email)
    expect(client.address).toBe(clientModel.address)
  })

  it('should map Client to ClientModel', () => {
    const id: Id = new Id()

    const client: Client = new Client({
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      name: 'client',
      email: 'teste@teste.com',
      address: 'Rua 1, 123, Bairro 1, Cidade 1, Estado 1',
    })

    const clientModel = ClientModelToClientMapper.toModel(client)

    expect(clientModel.id).toBe(client.id.value)
    expect(clientModel.createdAt).toEqual(client.createdAt)
    expect(clientModel.updatedAt).toEqual(client.updatedAt)
    expect(clientModel.name).toBe(client.name)
    expect(clientModel.email).toBe(client.email)
    expect(clientModel.address).toBe(client.address)
  })
})
