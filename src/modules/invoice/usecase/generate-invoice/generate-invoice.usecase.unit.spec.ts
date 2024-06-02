import { Id } from '@/modules/@shared/domain/value-object/id.value-object'
import { InvoiceGateway } from '@/modules/invoice/gateway/invoice.gateway'
import { CreateMockRepository } from '@/modules/invoice/test/invoice.test.utils'
import {
  GenerateInvoiceUsecaseInputDto,
  GenerateInvoiceUsecaseOutputDto,
} from '@/modules/invoice/usecase/generate-invoice/generate-invoice.dto'
import { GenerateInvoiceUsecase } from '@/modules/invoice/usecase/generate-invoice/generate-invoice.usecase'

describe('Generate Invoice use case unit tests', () => {
  let repository: InvoiceGateway
  let usecase: GenerateInvoiceUsecase
  let input: GenerateInvoiceUsecaseInputDto

  beforeEach(async () => {
    repository = CreateMockRepository()
    usecase = new GenerateInvoiceUsecase(repository)

    input = {
      name: 'Invoice 1',
      document: '123456789',
      street: 'Street 1',
      number: '123',
      complement: 'Complement 1',
      zipCode: '12345678',
      city: 'City 1',
      state: 'State 1',
      items: [
        {
          id: new Id().value,
          name: 'Product 1',
          price: 10,
          quantity: 1,
        },
        {
          id: new Id().value,
          name: 'Product 2',
          price: 20,
          quantity: 2,
        },
      ],
    }
  })

  it('should generate a invoice without an id', async () => {
    // Arrange

    // Act
    const output: GenerateInvoiceUsecaseOutputDto = await usecase.execute(input)

    // Assert
    expect(repository.save).toHaveBeenCalledTimes(1)
    expect(repository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        _id: expect.any(Id),
        _createdAt: expect.any(Date),
        _updatedAt: expect.any(Date),
        _name: input.name,
        _document: input.document,
        _address: expect.objectContaining({
          _street: input.street,
          _number: input.number,
          _complement: input.complement,
          _zipCode: input.zipCode,
          _city: input.city,
          _state: input.state,
        }),
        _items: expect.objectContaining(
          input.items.map((item) =>
            expect.objectContaining({
              _id: expect.any(Id),
              _name: item.name,
              _price: item.price,
              _quantity: item.quantity,
            })
          )
        ),
      })
    )

    expect(output).toBeDefined()
    expect(output).toEqual({
      id: expect.any(String),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      name: input.name,
      document: input.document,
      street: input.street,
      number: input.number,
      complement: input.complement,
      zipCode: input.zipCode,
      city: input.city,
      state: input.state,
      items: input.items.map((item) =>
        expect.objectContaining({
          id: expect.any(String),
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          total: item.price * item.quantity,
        })
      ),
      total: 50,
    })
  })

  it('should generate a invoice with an id', async () => {
    // Arrange
    const id = new Id()
    input.id = id.value

    // Act
    const output: GenerateInvoiceUsecaseOutputDto = await usecase.execute(input)

    // Assert
    expect(repository.save).toHaveBeenCalledTimes(1)
    expect(repository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        _id: id,
        _createdAt: expect.any(Date),
        _updatedAt: expect.any(Date),
        _name: input.name,
        _document: input.document,
        _address: expect.objectContaining({
          _street: input.street,
          _number: input.number,
          _complement: input.complement,
          _zipCode: input.zipCode,
          _city: input.city,
          _state: input.state,
        }),
        _items: expect.objectContaining(
          input.items.map((item) =>
            expect.objectContaining({
              _id: expect.any(Id),
              _name: item.name,
              _price: item.price,
              _quantity: item.quantity,
            })
          )
        ),
      })
    )

    expect(output).toBeDefined()
    expect(output).toEqual({
      id: id.value,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      name: input.name,
      document: input.document,
      street: input.street,
      number: input.number,
      complement: input.complement,
      zipCode: input.zipCode,
      city: input.city,
      state: input.state,
      items: input.items.map((item) =>
        expect.objectContaining({
          id: expect.any(String),
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          total: item.price * item.quantity,
        })
      ),
      total: 50,
    })
  })

  it('should throw an error when trying to create a invoice with an invalid id', async () => {
    // Arrange - Given
    input.id = 'invalid-id'

    // Act - When
    const output = usecase.execute(input)

    // Assert - Then
    await expect(output).rejects.toThrow(
      new Error('id: Invalid id: invalid-id')
    )
  })

  it('should throw an error when trying to create a invoice with an empty name', async () => {
    // Arrange
    input.name = ''

    // Act
    const output = usecase.execute(input)

    // Assert
    await expect(output).rejects.toThrow(
      new Error('invoice/invoice: Name is required')
    )
  })

  it('should throw an error when trying to create a invoice with an empty document', async () => {
    // Arrange
    input.document = ''

    // Act
    const output = usecase.execute(input)

    // Assert
    await expect(output).rejects.toThrow(
      new Error('invoice/invoice: Document is required')
    )
  })

  it('should throw an error when trying to create a invoice with an empty street', async () => {
    // Arrange
    input.street = ''

    // Act
    const output = usecase.execute(input)

    // Assert
    await expect(output).rejects.toThrow(
      new Error('address: Street is required')
    )
  })

  it('should throw an error when trying to create a invoice with an empty number', async () => {
    // Arrange
    input.number = ''

    // Act
    const output = usecase.execute(input)

    // Assert
    await expect(output).rejects.toThrow(
      new Error('address: Number is required')
    )
  })

  it('should throw an error when trying to create a invoice with an empty zip code', async () => {
    // Arrange
    input.zipCode = ''

    // Act
    const output = usecase.execute(input)

    // Assert
    await expect(output).rejects.toThrow(
      new Error('address: Zip code is required')
    )
  })

  it('should throw an error when trying to create a invoice with an empty city', async () => {
    // Arrange
    input.city = ''

    // Act
    const output = usecase.execute(input)

    // Assert
    await expect(output).rejects.toThrow(new Error('address: City is required'))
  })

  it('should throw an error when trying to create a invoice with an empty state', async () => {
    // Arrange
    input.state = ''

    // Act
    const output = usecase.execute(input)

    // Assert
    await expect(output).rejects.toThrow(
      new Error('address: State is required')
    )
  })

  it('should throw an error when trying to create a invoice with an empty item name', async () => {
    // Arrange
    input.items[0].name = ''

    // Act
    const output = usecase.execute(input)

    // Assert
    await expect(output).rejects.toThrow(
      new Error('invoice/invoice-item: Name is required')
    )
  })

  it('should throw an error when trying to create a invoice with an invalid item price', async () => {
    // Arrange
    input.items[0].price = -1

    // Act
    const output = usecase.execute(input)

    // Assert
    await expect(output).rejects.toThrow(
      new Error('invoice/invoice-item: Price must be greater than 0')
    )
  })

  it('should throw an error when trying to create a invoice with an invalid item quantity', async () => {
    // Arrange
    input.items[0].quantity = -1

    // Act
    const output = usecase.execute(input)

    // Assert
    await expect(output).rejects.toThrow(
      new Error('invoice/invoice-item: Quantity must be greater than 0')
    )
  })
})
