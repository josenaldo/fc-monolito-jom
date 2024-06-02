import { Id } from '@/modules/@shared/domain/value-object/id.value-object'
import { DomainToModelMapperInterface } from '@/modules/@shared/repository/domain-to-model-mapper.interface'
import { Client } from '@/modules/client-adm/domain/entity/client.entity'
import { ClientModelToClientMapper } from '@/modules/client-adm/repository/client-model-to-client.mapper'
import { ClientModel } from '@/modules/client-adm/repository/client.model'
import { InitSequelizeForClientAdmModule } from '@/modules/client-adm/test/client-adm.test.utils'
import { Sequelize } from 'sequelize-typescript'

describe('ClientModelToClientMapper unit tests', () => {
  let sequelize: Sequelize
  let mapper: DomainToModelMapperInterface<Client, ClientModel>

  beforeEach(async () => {
    sequelize = await InitSequelizeForClientAdmModule()
    mapper = new ClientModelToClientMapper()
  })

  afterEach(async () => {
    await sequelize.close()
  })

  it('should map ClientModel to Client', () => {
    const id: Id = new Id()

    const model: ClientModel = new ClientModel({
      id: id.value,
      createdAt: new Date(),
      updatedAt: new Date(),
      name: 'client',
      email: 'teste@teste.com',
      address: 'Rua 1, 123, Bairro 1, Cidade 1, Estado 1',
    })

    const domain = mapper.toDomain(model)

    expect(domain).toBeInstanceOf(Client)
    expect(domain.id.value).toBe(id.value)
    expect(domain.createdAt).toEqual(model.createdAt)
    expect(domain.updatedAt).toEqual(model.updatedAt)
    expect(domain.name).toBe(model.name)
    expect(domain.email).toBe(model.email)
    expect(domain.address).toBe(model.address)
  })

  it('should map Client to ClientModel', () => {
    const id: Id = new Id()

    const domain: Client = new Client({
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      name: 'client',
      email: 'teste@teste.com',
      address: 'Rua 1, 123, Bairro 1, Cidade 1, Estado 1',
    })

    const model = mapper.toModel(domain)

    expect(model.id).toBe(domain.id.value)
    expect(model.createdAt).toEqual(domain.createdAt)
    expect(model.updatedAt).toEqual(domain.updatedAt)
    expect(model.name).toBe(domain.name)
    expect(model.email).toBe(domain.email)
    expect(model.address).toBe(domain.address)
  })
})
