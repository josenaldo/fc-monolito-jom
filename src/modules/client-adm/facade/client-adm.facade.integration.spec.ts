import { Id } from '@/modules/@shared/domain/value-object/id.value-object'
import { ClientAdmFacade } from '@/modules/client-adm/facade/client-adm.facade'
import {
  AddClientFacadeInputDto,
  AddClientFacadeOutputDto,
  FindClientFacadeInputDto,
  FindClientFacadeOutputDto,
} from '@/modules/client-adm/facade/client-adm.facade.interface'
import { ClientAdmFacadeFactory } from '@/modules/client-adm/factory/client-adm.facade.factory'
import { ClientRepository } from '@/modules/client-adm/repository/client.repository'
import { InitSequelizeForClientAdmModule } from '@/modules/client-adm/test/client-adm.test.utils'
import { Sequelize } from 'sequelize-typescript'

describe('Client Adm facade integration tests', () => {
  let sequelize: Sequelize
  let clientAdmFacade: ClientAdmFacade
  let repository: ClientRepository

  beforeEach(async () => {
    sequelize = await InitSequelizeForClientAdmModule()

    repository = new ClientRepository()
    clientAdmFacade = ClientAdmFacadeFactory.create()
  })

  afterEach(async () => {
    await sequelize.close()
  })

  describe('when addClient', () => {
    it('should add a client with an id', async () => {
      // Arrange - Given
      const id = new Id()
      const input: AddClientFacadeInputDto = {
        id: id.value,
        name: 'Client',
        email: 't1@teste.com',
        address: 'Rua 1, 123, Bairro 1, Cidade 1, Estado 1',
      }

      // Act - When
      await clientAdmFacade.addClient(input)

      // Assert - Then
      const client = await repository.find(id.value)
      expect(client).toBeDefined()
      expect(client.id.value).toBe(id.value)
      expect(client.createdAt).toBeDefined()
      expect(client.updatedAt).toBeDefined()
      expect(client.name).toBe('Client')
      expect(client.email).toBe('t1@teste.com')
      expect(client.address).toBe('Rua 1, 123, Bairro 1, Cidade 1, Estado 1')
    })

    it('should add a client without an id', async () => {
      // Arrange - Given
      const input: AddClientFacadeInputDto = {
        name: 'client',
        email: 't1@teste.com',
        address: 'Rua 1, 123, Bairro 1, Cidade 1, Estado 1',
      }

      // Act - When
      const output: AddClientFacadeOutputDto =
        await clientAdmFacade.addClient(input)

      // Assert - Then
      const client = await repository.find(output.id)
      expect(client).toBeDefined()
      expect(client.id.value).toBe(output.id)
      expect(client.createdAt).toBeDefined()
      expect(client.updatedAt).toBeDefined()
      expect(client.name).toBe('client')
      expect(client.email).toBe('t1@teste.com')
      expect(client.address).toBe('Rua 1, 123, Bairro 1, Cidade 1, Estado 1')
    })

    it('should throw an error when trying to add a client with an existent id', async () => {
      // Arrange - Given
      const id = new Id()

      const input: AddClientFacadeInputDto = {
        id: id.value,
        name: 'Client 1',
        email: 't1@teste.com',
        address: 'Rua 1, 123, Bairro 1, Cidade 1, Estado 1',
      }

      // Act - When
      await clientAdmFacade.addClient(input)

      const input2: AddClientFacadeInputDto = {
        id: id.value,
        name: 'Client 2',
        email: 't2@teste.com',
        address: 'Rua 1, 456, Bairro 2, Cidade 2, Estado 2',
      }
      const output = clientAdmFacade.addClient(input2)

      // Assert - Then
      await expect(output).rejects.toThrow(new Error('Client already exists'))
    })

    it('should throw an error when client is invalid', async () => {
      // Arrange - Given
      const input: AddClientFacadeInputDto = {
        name: '',
        email: '',
        address: '',
      }

      // Act - When
      const output = clientAdmFacade.addClient(input)

      // Assert - Then
      await expect(output).rejects.toThrow(
        new Error(
          'client-adm/client: Name is required, Email is required, Address is required'
        )
      )
    })
  })

  describe('when findClient', () => {
    it('should find a client', async () => {
      // Arrange - Given
      const id = new Id()
      const input: AddClientFacadeInputDto = {
        id: id.value,
        name: 'Client',
        email: 't1@teste.com',
        address: 'Rua 1, 123, Bairro 1, Cidade 1, Estado 1',
      }
      await clientAdmFacade.addClient(input)

      const findInput: FindClientFacadeInputDto = { id: id.value }

      // Act - When
      const output: FindClientFacadeOutputDto =
        await clientAdmFacade.findClient(findInput)

      // Assert - Then
      expect(output).toBeDefined()
      expect(output.id).toBe(id.value)
      expect(output.createdAt).toBeDefined()
      expect(output.updatedAt).toBeDefined()
      expect(output.name).toBe('Client')
      expect(output.email).toBe('t1@teste.com')
      expect(output.address).toBe('Rua 1, 123, Bairro 1, Cidade 1, Estado 1')
    })

    it('should throw an error when client not found', async () => {
      // Arrange - Given
      const id = new Id()

      // Act - When
      const output = clientAdmFacade.findClient({ id: id.value })

      // Assert - Then
      await expect(output).rejects.toThrow(new Error('Client not found'))
    })
  })
})
