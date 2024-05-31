import { Id } from '@/modules/@shared/domain/value-object/id.value-object'
import { Client } from '@/modules/client-adm/domain/entity/client.entity'
import { ClientGateway } from '@/modules/client-adm/gateway/client.gateway'
import { CreateMockRepository } from '@/modules/client-adm/test/client-adm.test.utils'
import { FindClientUsecase } from '@/modules/client-adm/usecase/find-client/find-client.usecase'
import { FindClientInputDto } from '@/modules/client-adm/usecase/find-client/find-client.usecase.dto'

describe('Find Client use case unit tests', () => {
  let repository: ClientGateway
  let usecase: FindClientUsecase
  let input: FindClientInputDto
  let id: Id

  beforeEach(async () => {
    repository = CreateMockRepository()
    usecase = new FindClientUsecase(repository)

    id = new Id()
    input = {
      id: id.value,
    }
  })

  it('should find a client', async () => {
    // Arrange - Given
    const client = new Client({
      id: id,
      createdAt: new Date(),
      updatedAt: new Date(),
      name: 'Client 1',
      email: 'teste@teste.com',
      address: 'Rua 1, 123, Bairro 1, Cidade 1, Estado 1',
    })

    repository.find = jest.fn().mockResolvedValue(client)

    // Act - When
    const output = await usecase.execute(input)

    // Assert - Then
    expect(repository.find).toHaveBeenCalledTimes(1)
    expect(repository.find).toHaveBeenCalledWith(input.id)
    expect(output).toEqual({
      id: client.id.value,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
      name: client.name,
      email: client.email,
      address: client.address,
    })
  })

  it('should throw a client not found error when trying to find a client that does not exist', async () => {
    // Arrange - Given
    const id = new Id()
    repository.find = jest.fn().mockResolvedValue(undefined)

    // Act - When
    const output = usecase.execute({ id: id.value })

    // Assert - Then
    await expect(output).rejects.toThrow(new Error('Client not found'))
  })

  it('should throw a client not found error when trying to find a client with an invalid id', async () => {
    // Arrange - Given
    const id = 'invalid-id'
    repository.find = jest.fn().mockResolvedValue(undefined)

    // Act - When
    const output = usecase.execute({ id: id })

    // Assert - Then
    await expect(output).rejects.toThrow(new Error('Client not found'))
  })

  it('should throw a client not found error when trying to find a client with an empty id', async () => {
    // Arrange - Given
    const id = ''
    repository.find = jest.fn().mockResolvedValue(undefined)

    // Act - When
    const output = usecase.execute({ id: id })

    // Assert - Then
    await expect(output).rejects.toThrow(new Error('Client not found'))
  })
})
