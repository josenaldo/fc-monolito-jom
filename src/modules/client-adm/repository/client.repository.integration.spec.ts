import {
  Address,
  AddressProps,
} from '@/modules/@shared/domain/value-object/address'
import { Id } from '@/modules/@shared/domain/value-object/id.value-object'
import { Migrator } from '@/modules/@shared/test/migrator'
import { Client } from '@/modules/client-adm/domain/entity/client.entity'
import { ClientModel } from '@/modules/client-adm/repository/client.model'
import { ClientRepository } from '@/modules/client-adm/repository/client.repository'
import { CreateMigrator } from '@/modules/client-adm/test/client-adm.test.utils'

describe('Client Repository integration tests', () => {
  let migrator: Migrator
  let repository: ClientRepository
  let addressProps: AddressProps

  beforeEach(async () => {
    migrator = CreateMigrator()
    await migrator.up()

    repository = new ClientRepository()

    addressProps = {
      street: 'Rua 1',
      number: '123',
      complement: 'Bairro 1',
      city: 'Cidade 1',
      state: 'Estado 1',
      zipcode: '12345-123',
    }
  })

  afterEach(async () => {
    await migrator.down()
  })

  it('should create a client', async () => {
    // Arrange - Given
    const props = {
      name: 'client name',
      description: 'client description',
      email: 'teste@teste.com',
      document: '12345678900',
      address: new Address(addressProps),
    }
    const client = new Client(props)

    // Act - When
    await repository.add(client)

    // Assert - Then
    const clientModel = await ClientModel.findByPk(client.id.value)

    expect(clientModel).not.toBeNull()
    expect(clientModel.id).toBe(client.id.value)
    expect(clientModel.createdAt).toBeDefined()
    expect(clientModel.updatedAt).toBeDefined()
    expect(clientModel.name).toBe(client.name)
    expect(clientModel.email).toBe(client.email)
    expect(clientModel.street).toBe('Rua 1')
    expect(clientModel.number).toBe('123')
    expect(clientModel.complement).toBe('Bairro 1')
    expect(clientModel.city).toBe('Cidade 1')
    expect(clientModel.state).toBe('Estado 1')
  })

  it('should throw an error when trying to create a client with an existing id', async () => {
    // Arrange - Given
    const id = new Id()

    const props = {
      id: id.value,
      createdAt: new Date(),
      updatedAt: new Date(),
      name: 'Client 1',
      email: 'teste@teste.com',
      document: '12345678900',
      street: 'Rua 1',
      number: '123',
      complement: 'Bairro 1',
      city: 'Cidade 1',
      state: 'Estado 1',
      zipcode: '12345-123',
    }

    await ClientModel.create(props)

    const client = new Client({
      id: id,
      createdAt: new Date(),
      updatedAt: new Date(),
      name: 'Client 2',
      email: 'teste2@teste.com',
      document: '12345678901',
      address: new Address(addressProps),
    })
    // Act - When
    const output = repository.add(client)

    // Assert - Then
    await expect(output).rejects.toThrow(new Error('Client already exists'))
  })

  it('should find a client', async () => {
    // Arrange - Given
    const id1 = new Id()
    const id2 = new Id()

    await ClientModel.create({
      id: id1.value,
      createdAt: new Date(),
      updatedAt: new Date(),
      name: 'Client 1',
      email: 'teste1@teste.com',
      document: '12345678900',
      street: 'Rua 1',
      number: '123',
      complement: 'Bairro 1',
      city: 'Cidade 1',
      state: 'Estado 1',
      zipcode: '12345-123',
    })

    await ClientModel.create({
      id: id2.value,
      createdAt: new Date(),
      updatedAt: new Date(),
      name: 'Client 2',
      email: 'teste2@teste.com',
      document: '12345678901',
      street: 'Rua 2',
      number: '456',
      complement: 'Bairro 2',
      city: 'Cidade 2',
      state: 'Estado 2',
      zipcode: '12345-123',
    })

    // Act - When
    const client1 = await repository.find(id1.value)
    const client2 = await repository.find(id2.value)

    // Assert - Then
    expect(client1).not.toBeNull()
    expect(client1.id).toStrictEqual(id1)
    expect(client1.createdAt).toBeDefined()
    expect(client1.updatedAt).toBeDefined()
    expect(client1.name).toBe('Client 1')
    expect(client1.email).toBe('teste1@teste.com')
    expect(client1.document).toBe('12345678900')
    expect(client1.address).toBeDefined()
    expect(client1.address.street).toBe('Rua 1')
    expect(client1.address.number).toBe('123')
    expect(client1.address.complement).toBe('Bairro 1')
    expect(client1.address.city).toBe('Cidade 1')
    expect(client1.address.state).toBe('Estado 1')
    expect(client1.address.zipcode).toBe('12345-123')

    expect(client2).not.toBeNull()
    expect(client2.id).toStrictEqual(id2)
    expect(client2.createdAt).toBeDefined()
    expect(client2.updatedAt).toBeDefined()
    expect(client2.name).toBe('Client 2')
    expect(client2.email).toBe('teste2@teste.com')
    expect(client2.document).toBe('12345678901')
    expect(client2.address).toBeDefined()
    expect(client2.address.street).toBe('Rua 2')
    expect(client2.address.number).toBe('456')
    expect(client2.address.complement).toBe('Bairro 2')
    expect(client2.address.city).toBe('Cidade 2')
    expect(client2.address.state).toBe('Estado 2')
    expect(client2.address.zipcode).toBe('12345-123')
  })

  it('should throw a Not Found error when trying to find a client that does not exist', async () => {
    // Arrange - Given
    const id = new Id()

    // Act - When
    const f = async () => {
      await repository.find(id.value)
    }

    // Assert - Then
    await expect(f()).rejects.toThrow(new Error('Client not found'))
  })
})
