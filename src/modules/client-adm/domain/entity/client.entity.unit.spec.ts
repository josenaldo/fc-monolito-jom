import {
  Client,
  ClientProps,
} from '@/modules/client-adm/domain/entity/client.entity'

describe('Client unit tests', () => {
  let props: ClientProps

  beforeEach(async () => {
    props = {
      name: 'John Doe',
      email: 'john@doe.com',
      address:
        'Fake Street, 123, Fake Complement, 111111-111, Fake City, Fake State',
    }
  })

  it('should create a valid client', () => {
    // Arrange - Given
    // Act - When
    const output = new Client(props)

    // Assert - Then
    expect(output).toBeInstanceOf(Client)
    expect(output.id).not.toBeNull()
    expect(output.createdAt).not.toBeNull()
    expect(output.updatedAt).not.toBeNull()
    expect(output.name).toBe(props.name)
    expect(output.email).toBe(props.email)
    expect(output.address).toBe(props.address)
  })

  it('should throw a notification error if name is not empty', () => {
    // Arrange - Given
    props.name = ''

    // Act - When
    const output = () => new Client(props)

    // Assert - Then
    expect(output).toThrow(new Error('client-adm/client: Name is required'))
  })

  it('should throw a notification error if email is not empty', () => {
    // Arrange - Given
    props.email = ''

    // Act - When
    const output = () => new Client(props)

    // Assert - Then
    expect(output).toThrow(new Error('client-adm/client: Email is required'))
  })

  it('should throw a notification error if address is not empty', () => {
    // Arrange - Given
    props.address = ''

    // Act - When
    const output = () => new Client(props)

    // Assert - Then
    expect(output).toThrow(new Error('client-adm/client: Address is required'))
  })

  it('should throw a notification error if email is invalid', () => {
    // Arrange - Given
    props.email = 'john.doe.com'

    // Act - When
    const output = () => new Client(props)

    // Assert - Then
    expect(output).toThrow(new Error('client-adm/client: Invalid email'))
  })
})
