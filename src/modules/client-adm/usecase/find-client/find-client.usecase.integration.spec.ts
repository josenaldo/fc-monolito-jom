import { Id } from '@/modules/@shared/domain/value-object/id.value-object'
import { ClientGateway } from '@/modules/client-adm/gateway/client.gateway'
import { ClientModel } from '@/modules/client-adm/repository/client.model'
import { ClientRepository } from '@/modules/client-adm/repository/client.repository'
import { InitSequelizeForClientAdmModule } from '@/modules/client-adm/test/client-adm.test.utils'
import { FindClientUsecase } from '@/modules/client-adm/usecase/find-client/find-client.usecase'
import { Sequelize } from 'sequelize-typescript'

describe('Find Client use case integration tests', () => {
  let sequelize: Sequelize
  let repository: ClientGateway
  let usecase: FindClientUsecase
  let id1: string

  beforeEach(async () => {
    sequelize = await InitSequelizeForClientAdmModule()

    repository = new ClientRepository()
    usecase = new FindClientUsecase(repository)
    id1 = new Id().value

    await ClientModel.create({
      id: id1,
      createdAt: new Date(),
      updatedAt: new Date(),
      name: 'Client 1',
      email: 'teste1@teste.com',
      address: 'Rua 1, 123, Bairro 1, Cidade 1, Estado 1',
    })
  })

  afterEach(async () => {
    await sequelize.close()
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
      address: 'Rua 1, 123, Bairro 1, Cidade 1, Estado 1',
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
