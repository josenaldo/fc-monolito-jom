import { Id } from '@/modules/@shared/domain/value-object/id.value-object'
import {
  FindInvoiceFacadeInputDto,
  GenerateInvoiceFacadeInputDto,
  InvoiceFacadeInterface,
} from '@/modules/invoice/facade/invoice.facade.interface'
import { InvoiceFacadeFactory } from '@/modules/invoice/factory/invoice.facade.factory'
import InvoiceItemModel from '@/modules/invoice/repository/invoice-item.model'
import { InvoiceModel } from '@/modules/invoice/repository/invoice.model'
import { InitSequelizeForInvoiceModule } from '@/modules/invoice/test/invoice.test.utils'
import { Sequelize } from 'sequelize-typescript'

describe('Invoice Facade integration tests', () => {
  let sequelize: Sequelize
  let facade: InvoiceFacadeInterface
  let id = new Id()

  beforeEach(async () => {
    sequelize = await InitSequelizeForInvoiceModule()
    facade = InvoiceFacadeFactory.create()

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
        zipCode: '12345678',
        total: 50,
        items: [
          {
            id: new Id().value,
            name: 'Product 1',
            price: 10,
            quantity: 1,
            total: 10,
          },
          {
            id: new Id().value,
            name: 'Product 2',
            price: 20,
            quantity: 2,
            total: 40,
          },
        ],
      },
      {
        include: [{ model: InvoiceItemModel }],
      }
    )
  })

  afterEach(async () => {
    await sequelize.close()
  })

  it('should generate a invoice', async () => {
    const newId = new Id()
    // Arrange - Given
    const input: GenerateInvoiceFacadeInputDto = {
      id: newId.value,

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
    // Act - When
    const output = await facade.create(input)

    // Assert - Then
    expect(output).not.toBeNull()
    expect(output.id).toEqual(newId.value)
    expect(output.name).toEqual(input.name)
    expect(output.document).toEqual(input.document)
    expect(output.street).toEqual(input.street)
    expect(output.number).toEqual(input.number)
    expect(output.complement).toEqual(input.complement)
    expect(output.city).toEqual(input.city)
    expect(output.state).toEqual(input.state)
    expect(output.zipCode).toEqual(input.zipCode)
    expect(output.items).toHaveLength(2)
    expect(output.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          name: 'Product 1',
          price: 10,
          quantity: 1,
          total: 10,
        }),
        expect.objectContaining({
          id: expect.any(String),
          name: 'Product 2',
          price: 20,
          quantity: 2,
          total: 40,
        }),
      ])
    )
  })

  it('should find a invoice', async () => {
    // Arrange - Given
    const input: FindInvoiceFacadeInputDto = { id: id.value }

    // Act - When
    const output = await facade.find(input)

    // Assert - Then
    expect(output).toEqual({
      id: id.value,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      name: 'Invoice 1',
      document: '123456789',
      total: 50,
      address: {
        street: 'Street 1',
        number: '123',
        complement: 'Complement 1',
        city: 'City 1',
        state: 'State 1',
        zipCode: '12345678',
      },
      items: [
        {
          id: expect.any(String),
          name: 'Product 1',
          price: 10,
          quantity: 1,
          total: 10,
        },
        {
          id: expect.any(String),
          name: 'Product 2',
          price: 20,
          quantity: 2,
          total: 40,
        },
      ],
    })
  })

  it('should throw a Not Found error when trying to find a invoice that does not exist', async () => {
    // Arrange - Given
    const notFoundId = new Id()

    const input: FindInvoiceFacadeInputDto = { id: notFoundId.value }
    // Act - When
    const output = facade.find(input)

    // Assert - Then
    await expect(output).rejects.toThrow('Invoice not found')
  })
})
