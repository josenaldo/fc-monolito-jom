import { Id } from '@/modules/@shared/domain/value-object/id.value-object'
import { Client } from '@/modules/client-adm/domain/entity/client.entity'
import { ClientModel } from '@/modules/client-adm/repository/client.model'
import { ClientRepository } from '@/modules/client-adm/repository/client.repository'
import { CreateSequelizeWithModels } from '@/modules/client-adm/test/test.utils'
import { Sequelize } from 'sequelize-typescript'

describe('Client Repository integration tests', () => {
  let sequelize: Sequelize
  let repository: ClientRepository

  beforeEach(async () => {
    sequelize = await CreateSequelizeWithModels([ClientModel])

    repository = new ClientRepository()
  })

  afterEach(async () => {
    await sequelize.close()
  })

  it('should create a client', async () => {
    // Arrange - Given
    const props = {
      name: 'client name',
      description: 'client description',
      email: 'teste@teste.com',
      address: 'Rua 1, 123, Bairro 1, Cidade 1, Estado 1',
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
    expect(clientModel.address).toBe(client.address)
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
      address: 'Rua 1, 123, Bairro 1, Cidade 1, Estado 1',
    }

    await ClientModel.create(props)

    const client = new Client({
      id: id,
      createdAt: new Date(),
      updatedAt: new Date(),
      name: 'Client 2',
      email: 'teste2@teste.com',
      address: 'Rua 2, 456, Bairro 2, Cidade 2, Estado 2',
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
      address: 'Rua 1, 123, Bairro 1, Cidade 1, Estado 1',
    })

    await ClientModel.create({
      id: id2.value,
      createdAt: new Date(),
      updatedAt: new Date(),
      name: 'Client 2',
      email: 'teste2@teste.com',
      address: 'Rua 2, 456, Bairro 2, Cidade 2, Estado 2',
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
    expect(client1.address).toBe('Rua 1, 123, Bairro 1, Cidade 1, Estado 1')

    expect(client2).not.toBeNull()
    expect(client2.id).toStrictEqual(id2)
    expect(client2.createdAt).toBeDefined()
    expect(client2.updatedAt).toBeDefined()
    expect(client2.name).toBe('Client 2')
    expect(client2.email).toBe('teste2@teste.com')
    expect(client2.address).toBe('Rua 2, 456, Bairro 2, Cidade 2, Estado 2')
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
