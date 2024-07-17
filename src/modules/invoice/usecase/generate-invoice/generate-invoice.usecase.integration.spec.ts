import { Id } from '@/modules/@shared/domain/value-object/id.value-object'
import { Migrator } from '@/modules/@shared/test/migrator'
import { InvoiceGateway } from '@/modules/invoice/gateway/invoice.gateway'
import { InvoiceModel } from '@/modules/invoice/repository/invoice.model'
import { InvoiceRepository } from '@/modules/invoice/repository/invoice.repository'
import { CreateMigrator } from '@/modules/invoice/test/invoice.test.utils'
import {
  GenerateInvoiceUsecaseInputDto,
  GenerateInvoiceUsecaseOutputDto,
} from '@/modules/invoice/usecase/generate-invoice/generate-invoice.dto'
import { GenerateInvoiceUsecase } from '@/modules/invoice/usecase/generate-invoice/generate-invoice.usecase'

describe('Generate Invoice use case integration tests', () => {
  let migrator: Migrator
  let repository: InvoiceGateway
  let usecase: GenerateInvoiceUsecase
  let input: GenerateInvoiceUsecaseInputDto

  beforeEach(async () => {
    migrator = CreateMigrator()
    await migrator.up()

    repository = new InvoiceRepository()
    usecase = new GenerateInvoiceUsecase(repository)

    input = {
      name: 'Invoice 1',
      document: '123456789',
      street: 'Street 1',
      number: '123',
      complement: 'Complement 1',
      city: 'City 1',
      state: 'State 1',
      zipcode: '12345678',
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

  afterEach(async () => {
    await migrator.down()
  })

  it('should generate a invoice without an id', async () => {
    // Arrange

    // Act
    const output: GenerateInvoiceUsecaseOutputDto = await usecase.execute(input)

    // Assert
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
      city: input.city,
      state: input.state,
      zipcode: input.zipcode,
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

    const model = await InvoiceModel.findOne({
      where: { id: output.id },
      rejectOnEmpty: true,
      include: { all: true },
    })

    expect(model).toBeDefined()
    expect(model.id).toEqual(output.id)
    expect(model.name).toEqual(input.name)
    expect(model.document).toEqual(input.document)
    expect(model.street).toEqual(input.street)
    expect(model.number).toEqual(input.number)
    expect(model.complement).toEqual(input.complement)
    expect(model.zipcode).toEqual(input.zipcode)
    expect(model.city).toEqual(input.city)
    expect(model.state).toEqual(input.state)
    expect(model.items).toHaveLength(2)
  })

  it('should generate a invoice with an id', async () => {
    // Arrange
    const id = new Id()
    input.id = id.value

    // Act
    const output: GenerateInvoiceUsecaseOutputDto = await usecase.execute(input)

    // Assert
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
      city: input.city,
      state: input.state,
      zipcode: input.zipcode,
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

    const model = await InvoiceModel.findOne({
      where: { id: output.id },
      rejectOnEmpty: true,
      include: { all: true },
    })

    expect(model).toBeDefined()
    expect(model.id).toEqual(id.value)
    expect(model.name).toEqual(input.name)
    expect(model.document).toEqual(input.document)
    expect(model.street).toEqual(input.street)
    expect(model.number).toEqual(input.number)
    expect(model.complement).toEqual(input.complement)
    expect(model.zipcode).toEqual(input.zipcode)
    expect(model.city).toEqual(input.city)
    expect(model.state).toEqual(input.state)
    expect(model.items).toHaveLength(2)
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
    input.zipcode = ''

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
