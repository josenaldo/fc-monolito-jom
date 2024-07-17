import { Id } from '@/modules/@shared/domain/value-object/id.value-object'
import { Migrator } from '@/modules/@shared/test/migrator'
import { InvoiceGateway } from '@/modules/invoice/gateway/invoice.gateway'
import InvoiceItemModel from '@/modules/invoice/repository/invoice-item.model'
import { InvoiceModel } from '@/modules/invoice/repository/invoice.model'
import { InvoiceRepository } from '@/modules/invoice/repository/invoice.repository'
import { CreateMigrator } from '@/modules/invoice/test/invoice.test.utils'
import { FindInvoiceUsecase } from '@/modules/invoice/usecase/find-invoice/find-invoice.usecase'

describe('Find Invoice use case unit tests', () => {
  let migrator: Migrator
  let repository: InvoiceGateway
  let usecase: FindInvoiceUsecase
  let id: Id

  beforeEach(async () => {
    migrator = CreateMigrator()
    await migrator.up()

    repository = new InvoiceRepository()
    usecase = new FindInvoiceUsecase(repository)
    id = new Id()
    await InvoiceModel.create(
      {
        id: id.value,
        createdAt: new Date(),
        updatedAt: new Date(),
        name: 'Invoice 1',
        document: '123456789',
        street: 'Street 1',
        number: '123',
        complement: 'Complement 1',
        city: 'City 1',
        state: 'State 1',
        zipcode: '12345678',
        total: 10,
        items: [
          {
            id: new Id().value,
            createdAt: new Date(),
            updatedAt: new Date(),
            name: 'Product 1',
            price: 10,
            quantity: 1,
            total: 10,
          },
        ],
      },
      {
        include: [{ model: InvoiceItemModel }],
      }
    )
  })

  afterEach(async () => {
    await migrator.down()
  })

  it('should find a invoice', async () => {
    // Arrange - Given

    // Act - When
    const output = await usecase.execute({ id: id.value })

    // Assert - Then
    expect(output).toEqual({
      id: id.value,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      name: 'Invoice 1',
      document: '123456789',
      address: expect.objectContaining({
        street: 'Street 1',
        number: '123',
        complement: 'Complement 1',
        city: 'City 1',
        state: 'State 1',
        zipcode: '12345678',
      }),
      total: 10,
      items: expect.arrayContaining([
        {
          id: expect.any(String),
          name: 'Product 1',
          price: 10,
          quantity: 1,
          total: 10,
        },
      ]),
    })
  })

  it('should throw a Not Found error when trying to find a invoice that does not exist', async () => {
    // Arrange - Given
    const id = new Id().value

    // Act - When
    const output = usecase.execute({ id: id })

    // Assert - Then
    await expect(output).rejects.toThrow(new Error('Invoice not found'))
  })

  it('should throw an error when trying to find a invoice with an invalid id', async () => {
    // Arrange - Given
    const id = 'invalid-id'

    // Act - When
    const output = usecase.execute({ id: id })

    // Assert - Then
    await expect(output).rejects.toThrow(new Error('Invoice not found'))
  })

  it('should throw an error when trying to find a invoice with an empty id', async () => {
    // Arrange - Given
    const id = ''

    // Act - When
    const output = usecase.execute({ id: id })

    // Assert - Then
    await expect(output).rejects.toThrow(new Error('Invoice not found'))
  })
})
