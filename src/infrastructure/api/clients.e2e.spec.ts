import { app } from '@/infrastructure/app-config'
import { CreateE2EMigrator } from '@/infrastructure/test.utils'
import { AddressProps } from '@/modules/@shared/domain/value-object/address'
import { Id } from '@/modules/@shared/domain/value-object/id.value-object'
import { Migrator } from '@/modules/@shared/test/migrator'
import { AddClientFacadeInputDto } from '@/modules/client-adm/facade/client-adm.facade.interface'
import supertest from 'supertest'
import TestAgent from 'supertest/lib/agent.js'

describe('Clients E2E tests', () => {
  let migrator: Migrator
  let request: TestAgent
  let addressProps: AddressProps
  let id: Id
  let input: AddClientFacadeInputDto

  beforeEach(async () => {
    migrator = CreateE2EMigrator()
    await migrator.up()
    request = supertest(app)

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
      const response = await request.post('/clients').send(input)

      // Assert - Then
      expect(response.status).toBe(201)
      expect(response.body).toBeDefined()

      expect(response.body.id).toBe(id.value)
      expect(response.body.createdAt).toBeDefined()
      expect(response.body.updatedAt).toBeDefined()
      expect(response.body.name).toBe('Client')
      expect(response.body.email).toBe('t1@teste.com')
      expect(response.body.address).toBeDefined()
      expect(response.body.address.street).toBe('Rua 1')
      expect(response.body.address.number).toBe('123')
      expect(response.body.address.complement).toBe('Bairro 1')
      expect(response.body.address.city).toBe('Cidade 1')
      expect(response.body.address.state).toBe('Estado 1')
      expect(response.body.address.zipcode).toBe('12345-123')
    })

    it('should add a client without an id', async () => {
      // Arrange - Given
      delete input.id

      // Act - When
      const response = await request.post('/clients').send(input)

      // Assert - Then
      expect(response.body).toBeDefined()
      expect(response.body.id).toBeDefined()
      expect(response.body.createdAt).toBeDefined()
      expect(response.body.updatedAt).toBeDefined()
      expect(response.body.name).toBe('Client')
      expect(response.body.email).toBe('t1@teste.com')
      expect(response.body.address).toBeDefined()
      expect(response.body.address.street).toBe('Rua 1')
      expect(response.body.address.number).toBe('123')
      expect(response.body.address.complement).toBe('Bairro 1')
      expect(response.body.address.city).toBe('Cidade 1')
      expect(response.body.address.state).toBe('Estado 1')
      expect(response.body.address.zipcode).toBe('12345-123')
    })

    it('should throw an error when trying to add a client with an existent id', async () => {
      // Arrange - Given

      // Act - When
      await request.post('/clients').send(input)

      const input2: AddClientFacadeInputDto = {
        id: id.value,
        name: 'Client 2',
        email: 't2@teste.com',
        document: '12345678901',
        address: addressProps,
      }
      const response = await request.post('/clients').send(input2)

      // Assert - Then
      expect(response.status).toBe(409)
      expect(response.body).toBeDefined()
      expect(response.body.error).toBe('Client already exists')
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
      const response = await request.post('/clients').send(input)

      // Assert - Then
      expect(response.status).toBe(400)
      expect(response.body).toBeDefined()
      expect(response.body.error).toBeDefined()
      expect(response.body.error).toBe(
        'client-adm/client: Name is required, Email is required, Document is required, Address is required'
      )
    })
  })

  describe('when findClient', () => {
    it('should find a client', async () => {
      // Arrange - Given
      await request.post('/clients').send(input)

      // Act - When
      const response = await request.get(`/clients/${id.value}`)

      // Assert - Then
      expect(response.status).toBe(200)
      expect(response.body).toBeDefined()
      expect(response.body.id).toBe(id.value)
      expect(response.body.createdAt).toBeDefined()
      expect(response.body.updatedAt).toBeDefined()
      expect(response.body.name).toBe('Client')
      expect(response.body.email).toBe('t1@teste.com')
      expect(response.body.address).toBeDefined()
      expect(response.body.address.street).toBe('Rua 1')
      expect(response.body.address.number).toBe('123')
      expect(response.body.address.complement).toBe('Bairro 1')
      expect(response.body.address.city).toBe('Cidade 1')
      expect(response.body.address.state).toBe('Estado 1')
    })

    it('should throw an error when client not found', async () => {
      // Arrange - Given
      const id = new Id()

      // Act - When
      const response = await request.get(`/clients/${id.value}`)

      // Assert - Then
      expect(response.status).toBe(404)
      expect(response.body).toBeDefined()
      expect(response.body.error).toBe('Client not found')
    })
  })
})
