import { Id } from '@/modules/@shared/domain/value-object/id.value-object'
import { Client } from '@/modules/client-adm/domain/client.entity'
import { ClientGateway } from '@/modules/client-adm/gateway/client.gateway'
import { CreateMockRepository } from '@/modules/client-adm/test/test.utils'
import { FindClientUsecase } from '@/modules/client-adm/usecase/find-client/find-client.usecase'
import { FindClientInputDto } from '@/modules/client-adm/usecase/find-client/find-client.usecase.dto'

describe('Find Client use case unit tests', () => {
  let gateway: ClientGateway
  let usecase: FindClientUsecase
  let input: FindClientInputDto
  let id: Id

  beforeEach(async () => {
    gateway = CreateMockRepository()
    usecase = new FindClientUsecase(gateway)
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

    gateway.find = jest.fn().mockResolvedValue(client)

    // Act - When
    const output = await usecase.execute(input)

    // Assert - Then
    expect(gateway.find).toHaveBeenCalledTimes(1)
    expect(gateway.find).toHaveBeenCalledWith(input.id)
    expect(output).toEqual({
      id: client.id.value,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
      name: client.name,
      email: client.email,
      address: client.address,
    })
  })

  it('should throw a client not found error when the client does not exist', async () => {
    // Arrange - Given
    const id = new Id().value
    gateway.find = jest.fn().mockResolvedValue(undefined)

    // Act - When
    const output = usecase.execute({ id: id })

    // Assert - Then
    await expect(output).rejects.toThrow(new Error('Client not found'))
  })
})
