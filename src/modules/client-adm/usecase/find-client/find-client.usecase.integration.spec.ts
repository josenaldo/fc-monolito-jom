import { AddressProps } from '@/modules/@shared/domain/value-object/address'
import { Id } from '@/modules/@shared/domain/value-object/id.value-object'
import { Migrator } from '@/modules/@shared/test/migrator'
import { ClientGateway } from '@/modules/client-adm/gateway/client.gateway'
import { ClientModel } from '@/modules/client-adm/repository/client.model'
import { ClientRepository } from '@/modules/client-adm/repository/client.repository'
import { CreateMigrator } from '@/modules/client-adm/test/client-adm.test.utils'
import { FindClientUsecase } from '@/modules/client-adm/usecase/find-client/find-client.usecase'

describe('Find Client use case integration tests', () => {
  let migrator: Migrator
  let repository: ClientGateway
  let usecase: FindClientUsecase
  let id1: string
  let addressProps: AddressProps

  beforeEach(async () => {
    migrator = CreateMigrator()
    await migrator.up()

    repository = new ClientRepository()
    usecase = new FindClientUsecase(repository)
    id1 = new Id().value

    addressProps = {
      street: 'Rua 1',
      number: '123',
      complement: 'Bairro 1',
      city: 'Cidade 1',
      state: 'Estado 1',
      zipcode: '12345-123',
    }

    await ClientModel.create({
      id: id1,
      createdAt: new Date(),
      updatedAt: new Date(),
      name: 'Client 1',
      email: 'teste1@teste.com',
      document: '12345678901',
      street: addressProps.street,
      number: addressProps.number,
      complement: addressProps.complement,
      city: addressProps.city,
      state: addressProps.state,
      zipcode: addressProps.zipcode,
    })
  })

  afterEach(async () => {
    await migrator.down()
  })

  it('should find a client', async () => {
    // Arrange - Given

    // Act - When
    const output = await usecase.execute({ id: id1 })

    // Assert - Then
    expect(output).toEqual({
      id: expect.any(String),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      name: 'Client 1',
      email: 'teste1@teste.com',
      document: '12345678901',
      address: expect.objectContaining(addressProps),
    })
  })

  it('should throw a client not found error when trying to find a client that does not exist', async () => {
    // Arrange - Given
    const id = new Id()

    // Act - When
    const output = usecase.execute({ id: id.value })

    // Assert - Then
    await expect(output).rejects.toThrow(new Error('Client not found'))
  })

  it('should throw a client not found error when trying to find a client with an invalid id', async () => {
    // Arrange - Given
    const id = 'invalid-id'

    // Act - When
    const output = usecase.execute({ id: id })

    // Assert - Then
    await expect(output).rejects.toThrow(new Error('Client not found'))
  })

  it('should throw a client not found error when trying to find a client with an empty id', async () => {
    // Arrange - Given
    const id = ''

    // Act - When
    const output = usecase.execute({ id: id })

    // Assert - Then
    await expect(output).rejects.toThrow(new Error('Client not found'))
  })
})
