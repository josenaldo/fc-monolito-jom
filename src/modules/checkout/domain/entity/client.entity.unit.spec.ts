import { Address } from '@/modules/@shared/domain/value-object/address'
import {
  Client,
  ClientProps,
} from '@/modules/checkout/domain/entity/client.entity'

describe('Client unit tests', () => {
  let props: ClientProps

  beforeEach(async () => {
    props = {
      name: 'John Doe',
      email: 'john@doe.com',
      document: '12345678900',
      address: new Address({
        street: 'Fake Street',
        number: '123',
        complement: 'Fake Complement',
        city: 'Fake City',
        state: 'Fake State',
        zipCode: '12345-123',
      }),
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
    expect(output.address).toBeInstanceOf(Address)
    expect(output.address.street).toBe(props.address.street)
    expect(output.address.number).toBe(props.address.number)
    expect(output.address.complement).toBe(props.address.complement)
    expect(output.address.city).toBe(props.address.city)
    expect(output.address.state).toBe(props.address.state)
    expect(output.address.zipCode).toBe(props.address.zipCode)
  })

  it('should throw a notification error if name is not empty', () => {
    // Arrange - Given
    props.name = ''

    // Act - When
    const output = () => new Client(props)

    // Assert - Then
    expect(output).toThrow(new Error('checkout/client: Name is required'))
  })

  it('should throw a notification error if email is not empty', () => {
    // Arrange - Given
    props.email = ''

    // Act - When
    const output = () => new Client(props)

    // Assert - Then
    expect(output).toThrow(new Error('checkout/client: Email is required'))
  })

  it('should throw a notification error if address is not empty', () => {
    // Arrange - Given
    props.address = null

    // Act - When
    const output = () => new Client(props)

    // Assert - Then
    expect(output).toThrow(new Error('checkout/client: Address is required'))
  })

  it('should throw a notification error if email is invalid', () => {
    // Arrange - Given
    props.email = 'john.doe.com'

    // Act - When
    const output = () => new Client(props)

    // Assert - Then
    expect(output).toThrow(new Error('checkout/client: Invalid email'))
  })
})
