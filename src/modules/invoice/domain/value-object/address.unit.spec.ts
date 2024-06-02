import Address, {
  AddressProps,
} from '@/modules/invoice/domain/value-object/address'

describe('Address unit tests', () => {
  let addressProps: AddressProps

  beforeEach(() => {
    addressProps = {
      street: 'Fake Street',
      number: '123',
      complement: 'Fake Complement',
      zipCode: '12345-123',
      city: 'Fake City',
      state: 'Fake State',
    }
  })
  it('should create an Address instance', () => {
    // Arrange - Given

    // Act - When
    const address = new Address(addressProps)

    // Assert - Then
    expect(address).toBeDefined()
    expect(address.street).toBe(addressProps.street)
    expect(address.number).toBe(addressProps.number)
    expect(address.complement).toBe(addressProps.complement)
    expect(address.zipCode).toBe(addressProps.zipCode)
    expect(address.city).toBe(addressProps.city)
    expect(address.state).toBe(addressProps.state)
  })

  it('should throw an error if street is empty', () => {
    // Arrange - Given
    addressProps.street = ''

    // Act - When
    const address = () => new Address(addressProps)

    // Assert - Then
    expect(address).toThrow('address: Street is required')
  })

  it('should throw an error if number is empty', () => {
    // Arrange - Given
    addressProps.number = ''

    // Act - When
    const address = () => new Address(addressProps)

    // Assert - Then
    expect(address).toThrow('address: Number is required')
  })

  it('should creater an adress without a complement', () => {
    // Arrange - Given
    addressProps.complement = undefined

    // Act - When
    const address = new Address(addressProps)

    // Assert - Then
    expect(address).toBeDefined()
    expect(address.street).toBe(addressProps.street)
    expect(address.number).toBe(addressProps.number)
    expect(address.complement).toBeUndefined()
    expect(address.zipCode).toBe(addressProps.zipCode)
    expect(address.city).toBe(addressProps.city)
    expect(address.state).toBe(addressProps.state)
  })

  it('should throw an error if zip code is empty', () => {
    // Arrange - Given
    addressProps.zipCode = ''

    // Act - When
    const address = () => new Address(addressProps)

    // Assert - Then
    expect(address).toThrow('address: Zip code is required')
  })

  it('should throw an error if city is empty', () => {
    // Arrange - Given
    addressProps.city = ''

    // Act - When
    const address = () => new Address(addressProps)

    // Assert - Then
    expect(address).toThrow('address: City is required')
  })

  it('should throw an error if state is empty', () => {
    // Arrange - Given
    addressProps.state = ''

    // Act - When
    const address = () => new Address(addressProps)

    // Assert - Then
    expect(address).toThrow('address: State is required')
  })
})
