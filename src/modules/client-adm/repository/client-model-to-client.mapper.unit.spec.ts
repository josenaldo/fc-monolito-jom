import { Address } from '@/modules/@shared/domain/value-object/address'
import { Id } from '@/modules/@shared/domain/value-object/id.value-object'
import { DomainToModelMapperInterface } from '@/modules/@shared/repository/domain-to-model-mapper.interface'
import { Migrator } from '@/modules/@shared/test/migrator'
import { Client } from '@/modules/client-adm/domain/entity/client.entity'
import { ClientModelToClientMapper } from '@/modules/client-adm/repository/client-model-to-client.mapper'
import { ClientModel } from '@/modules/client-adm/repository/client.model'
import { CreateMigrator } from '@/modules/client-adm/test/client-adm.test.utils'

describe('ClientModelToClientMapper unit tests', () => {
  let migrator: Migrator
  let mapper: DomainToModelMapperInterface<Client, ClientModel>

  beforeEach(async () => {
    migrator = CreateMigrator()
    await migrator.up()
    mapper = new ClientModelToClientMapper()
  })

  afterEach(async () => {
    await migrator.down()
  })

  it('should map ClientModel to Client', () => {
    const id: Id = new Id()

    const model: ClientModel = new ClientModel({
      id: id.value,
      createdAt: new Date(),
      updatedAt: new Date(),
      name: 'client',
      email: 'teste@teste.com',
      document: '12345678900',
      street: 'Rua 1',
      number: '123',
      complement: 'Bairro 1',
      city: 'Cidade 1',
      state: 'Estado 1',
      zipcode: '12345-123',
    })

    const domain = mapper.toDomain(model)

    expect(domain).toBeInstanceOf(Client)
    expect(domain.id.value).toBe(id.value)
    expect(domain.createdAt).toEqual(model.createdAt)
    expect(domain.updatedAt).toEqual(model.updatedAt)
    expect(domain.name).toBe(model.name)
    expect(domain.email).toBe(model.email)
    expect(domain.document).toBe(model.document)
    expect(domain.address).toBeDefined()
    expect(domain.address).toBeInstanceOf(Address)
    expect(domain.address.street).toBe(model.street)
    expect(domain.address.number).toBe(model.number)
    expect(domain.address.complement).toBe(model.complement)
    expect(domain.address.city).toBe(model.city)
    expect(domain.address.state).toBe(model.state)
    expect(domain.address.zipcode).toBe(model.zipcode)
  })

  it('should map Client to ClientModel', () => {
    const id: Id = new Id()

    const domain: Client = new Client({
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      name: 'client',
      email: 'teste@teste.com',
      document: '12345678900',
      address: new Address({
        street: 'Rua 1',
        number: '123',
        complement: 'Bairro 1',
        city: 'Cidade 1',
        state: 'Estado 1',
        zipcode: '12345-123',
      }),
    })

    const model = mapper.toModel(domain)

    expect(model.id).toBe(domain.id.value)
    expect(model.createdAt).toEqual(domain.createdAt)
    expect(model.updatedAt).toEqual(domain.updatedAt)
    expect(model.name).toBe(domain.name)
    expect(model.email).toBe(domain.email)
    expect(model.document).toBe(domain.document)
    expect(model.street).toBe(domain.address.street)
    expect(model.number).toBe(domain.address.number)
    expect(model.complement).toBe(domain.address.complement)
    expect(model.city).toBe(domain.address.city)
    expect(model.state).toBe(domain.address.state)
    expect(model.zipcode).toBe(domain.address.zipcode)
  })
})
