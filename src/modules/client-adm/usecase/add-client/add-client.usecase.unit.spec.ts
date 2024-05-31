import { Id } from '@/modules/@shared/domain/value-object/id.value-object'
import { ClientGateway } from '@/modules/client-adm/gateway/client.gateway'
import { CreateMockRepository } from '@/modules/client-adm/test/client-adm.test.utils'
import { AddClientUsecase } from '@/modules/client-adm/usecase/add-client/add-client.usecase'
import { AddClientInputDto } from '@/modules/client-adm/usecase/add-client/add-client.usecase.dto'

describe('Add Client use case unit tests', () => {
  let repository: ClientGateway
  let usecase: AddClientUsecase
  let input: AddClientInputDto

  beforeEach(async () => {
    repository = CreateMockRepository()
    usecase = new AddClientUsecase(repository)

    input = {
      name: 'Client 1',
      email: 'cliente@gmail.com',
      address: 'Rua 1, 123, Bairro 1, Cidade 1, Estado 1',
    }
  })

  it('should add a client without an id', async () => {
    // Arrange - Given

    // Act - When
    const output = await usecase.execute(input)

    // Assert - Then
    expect(repository.add).toHaveBeenCalledTimes(1)
    expect(repository.add).toHaveBeenCalledWith(
      expect.objectContaining({
        _id: expect.any(Id),
        _createdAt: expect.any(Date),
        _updatedAt: expect.any(Date),
        _name: input.name,
        _email: input.email,
        _address: input.address,
      })
    )
    expect(output).toBeDefined()
    expect(output).toEqual({
      id: expect.any(String),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      name: input.name,
      email: input.email,
      address: input.address,
    })
  })

  it('should add a client with an id', async () => {
    // Arrange - Given
    const id = new Id()
    input.id = id.value

    // Act - When
    const output = await usecase.execute(input)

    // Assert - Then

    expect(repository.add).toHaveBeenCalledTimes(1)
    expect(repository.add).toHaveBeenCalledWith(
      expect.objectContaining({
        _id: id,
        _createdAt: expect.any(Date),
        _updatedAt: expect.any(Date),
        _name: input.name,
        _email: input.email,
        _address: input.address,
      })
    )
    expect(output).toBeDefined()
    expect(output).toEqual({
      id: id.value,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      name: input.name,
      email: input.email,
      address: input.address,
    })
  })

  it('should throw an error when trying to create a client with an invalid id', async () => {
    // Arrange - Given
    input.id = 'invalid-id'

    // Act - When
    const output = usecase.execute(input)

    // Assert - Then
    await expect(output).rejects.toThrow(new Error('Invalid id'))
  })

  it('should throw an error when trying to create a client with an empty name', async () => {
    // Arrange - Given
    input.name = ''

    // Act - When
    const output = usecase.execute(input)

    // Assert - Then
    await expect(output).rejects.toThrow(
      new Error('client-adm/client: Name is required')
    )
  })

  it('should throw an error when trying to create a client with an empty email', async () => {
    // Arrange - Given
    input.email = ''

    // Act - When
    const output = usecase.execute(input)

    // Assert - Then
    await expect(output).rejects.toThrow(
      new Error('client-adm/client: Email is required')
    )
  })

  it('should throw an error when trying to create a client with an empty address', async () => {
    // Arrange - Given
    input.address = ''

    // Act - When
    const output = usecase.execute(input)

    // Assert - Then
    await expect(output).rejects.toThrow(
      new Error('client-adm/client: Address is required')
    )
  })

  it('should throw an error when trying to create a client with an invalid email', async () => {
    // Arrange - Given
    input.email = 'invalid-email'

    // Act - When
    const output = usecase.execute(input)

    // Assert - Then
    await expect(output).rejects.toThrow(
      new Error('client-adm/client: Invalid email')
    )
  })
})
