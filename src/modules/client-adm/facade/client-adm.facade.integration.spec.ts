import { AddressProps } from '@/modules/@shared/domain/value-object/address'
import { Id } from '@/modules/@shared/domain/value-object/id.value-object'
import { Migrator } from '@/modules/@shared/test/migrator'
import { ClientAdmFacade } from '@/modules/client-adm/facade/client-adm.facade'
import {
  AddClientFacadeInputDto,
  AddClientFacadeOutputDto,
  FindClientFacadeInputDto,
  FindClientFacadeOutputDto,
} from '@/modules/client-adm/facade/client-adm.facade.interface'
import { ClientAdmFacadeFactory } from '@/modules/client-adm/factory/client-adm.facade.factory'
import { ClientRepository } from '@/modules/client-adm/repository/client.repository'
import { CreateMigrator } from '@/modules/client-adm/test/client-adm.test.utils'

describe('Client Adm facade integration tests', () => {
  let migrator: Migrator

  let clientAdmFacade: ClientAdmFacade
  let repository: ClientRepository
  let addressProps: AddressProps
  let id: Id
  let input: AddClientFacadeInputDto

  beforeEach(async () => {
    migrator = CreateMigrator()
    await migrator.up()

    repository = new ClientRepository()
    clientAdmFacade = ClientAdmFacadeFactory.create()

    addressProps = {
      street: 'Rua 1',
      number: '123',
      complement: 'Bairro 1',
      city: 'Cidade 1',
      state: 'Estado 1',
      zipcode: '12345-123',
    }

    id = new Id()
    input = {
      id: id.value,
      name: 'Client',
      email: 't1@teste.com',
      document: '12345678900',
      address: addressProps,
    }
  })

  afterEach(async () => {
    await migrator.down()
  })

  describe('when addClient', () => {
    it('should add a client with an id', async () => {
      // Arrange - Given

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
      expect(client.address).toBeDefined()
      expect(client.address.street).toBe('Rua 1')
      expect(client.address.number).toBe('123')
      expect(client.address.complement).toBe('Bairro 1')
      expect(client.address.city).toBe('Cidade 1')
      expect(client.address.state).toBe('Estado 1')
    })

    it('should add a client without an id', async () => {
      // Arrange - Given
      delete input.id

      // Act - When
      const output: AddClientFacadeOutputDto =
        await clientAdmFacade.addClient(input)

      // Assert - Then
      const client = await repository.find(output.id)
      expect(client).toBeDefined()
      expect(client.id.value).toBe(output.id)
      expect(client.createdAt).toBeDefined()
      expect(client.updatedAt).toBeDefined()
      expect(client.name).toBe('Client')
      expect(client.email).toBe('t1@teste.com')
      expect(client.address).toBeDefined()
      expect(client.address.street).toBe('Rua 1')
      expect(client.address.number).toBe('123')
      expect(client.address.complement).toBe('Bairro 1')
      expect(client.address.city).toBe('Cidade 1')
      expect(client.address.state).toBe('Estado 1')
    })

    it('should throw an error when trying to add a client with an existent id', async () => {
      // Arrange - Given
      // Act - When
      await clientAdmFacade.addClient(input)

      const input2: AddClientFacadeInputDto = {
        id: id.value,
        name: 'Client 2',
        email: 't2@teste.com',
        document: '12345678901',
        address: addressProps,
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
        document: '',
        address: null,
      }

      // Act - When
      const output = clientAdmFacade.addClient(input)

      // Assert - Then
      await expect(output).rejects.toThrow(
        new Error(
          'client-adm/client: Name is required, Email is required, Document is required, Address is required'
        )
      )
    })
  })

  describe('when findClient', () => {
    it('should find a client', async () => {
      // Arrange - Given
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
      expect(output.address).toBeDefined()
      expect(output.address.street).toBe('Rua 1')
      expect(output.address.number).toBe('123')
      expect(output.address.complement).toBe('Bairro 1')
      expect(output.address.city).toBe('Cidade 1')
      expect(output.address.state).toBe('Estado 1')
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
