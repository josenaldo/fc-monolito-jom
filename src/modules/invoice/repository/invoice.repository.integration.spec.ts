import { Address } from '@/modules/@shared/domain/value-object/address'
import { Id } from '@/modules/@shared/domain/value-object/id.value-object'
import { InvoiceItem } from '@/modules/invoice/domain/entity/invoice-item.entity'
import {
  Invoice,
  InvoiceProps,
} from '@/modules/invoice/domain/entity/invoice.entity'
import InvoiceItemModel from '@/modules/invoice/repository/invoice-item.model'
import { InvoiceModel } from '@/modules/invoice/repository/invoice.model'
import { InvoiceRepository } from '@/modules/invoice/repository/invoice.repository'
import { InitSequelizeForInvoiceModule } from '@/modules/invoice/test/invoice.test.utils'
import { Sequelize } from 'sequelize-typescript'

describe('Invoice Repository integration tests', () => {
  let sequelize: Sequelize
  let repository: InvoiceRepository
  let address: Address
  let item1: InvoiceItem
  let item2: InvoiceItem

  beforeEach(async () => {
    sequelize = await InitSequelizeForInvoiceModule()

    repository = new InvoiceRepository()

    address = new Address({
      street: 'Street 1',
      number: '123',
      complement: 'Complement 1',
      city: 'City 1',
      state: 'State 1',
      zipCode: '12345678',
    })

    item1 = new InvoiceItem({
      id: new Id(),
      name: 'Product 1',
      price: 10,
      quantity: 1,
    })

    item2 = new InvoiceItem({
      id: new Id(),
      name: 'Product 2',
      price: 20,
      quantity: 2,
    })
  })

  afterEach(async () => {
    await sequelize.close()
  })

  it('should create a invoice', async () => {
    // Arrange - Given
    const invoiceProps: InvoiceProps = {
      id: new Id(),
      createdAt: new Date(),
      updatedAt: new Date(),
      name: 'Invoice 1',
      document: '123456789',
      address: address,
      items: [item1, item2],
    }

    const invoice = new Invoice(invoiceProps)

    // Act - When
    await repository.save(invoice)

    // Assert - Then
    const invoiceModel = await InvoiceModel.findOne({
      where: { id: invoice.id.value },
      include: [InvoiceItemModel],
    })

    expect(invoiceModel).not.toBeNull()
    expect(invoiceModel.id).toBe(invoice.id.value)
    expect(invoiceModel.createdAt).toBeDefined()
    expect(invoiceModel.updatedAt).toBeDefined()
    expect(invoiceModel.name).toBe(invoice.name)
    expect(invoiceModel.document).toBe(invoice.document)
    expect(invoiceModel.street).toBe(invoice.address.street)
    expect(invoiceModel.number).toBe(invoice.address.number)
    expect(invoiceModel.complement).toBe(invoice.address.complement)
    expect(invoiceModel.zipCode).toBe(invoice.address.zipCode)
    expect(invoiceModel.city).toBe(invoice.address.city)
    expect(invoiceModel.state).toBe(invoice.address.state)
    expect(invoiceModel.total).toBe(invoice.total)
    expect(invoiceModel.items).toHaveLength(2)
    expect(invoiceModel.items[0].id).toBe(item1.id.value)
    expect(invoiceModel.items[0].name).toBe(item1.name)
    expect(invoiceModel.items[0].price).toBe(item1.price)
    expect(invoiceModel.items[0].quantity).toBe(item1.quantity)
    expect(invoiceModel.items[0].total).toBe(item1.total)
    expect(invoiceModel.items[1].id).toBe(item2.id.value)
    expect(invoiceModel.items[1].name).toBe(item2.name)
    expect(invoiceModel.items[1].price).toBe(item2.price)
    expect(invoiceModel.items[1].quantity).toBe(item2.quantity)
    expect(invoiceModel.items[1].total).toBe(item2.total)
  })

  it('should throw an error when trying to create a invoice with an existing id', async () => {
    // Arrange - Given
    const id = new Id()

    const invoiceProps: InvoiceProps = {
      id: id,
      createdAt: new Date(),
      updatedAt: new Date(),
      name: 'Invoice 1',
      document: '123456789',
      address: address,
      items: [item1],
    }
    const invoice1 = new Invoice(invoiceProps)
    await repository.save(invoice1)

    const invoice = new Invoice({
      id: id,
      createdAt: new Date(),
      updatedAt: new Date(),
      name: 'Invoice 2',
      document: '123456788',
      address: address,
      items: [item2],
    })
    // Act - When
    const output = repository.save(invoice)

    // Assert - Then
    await expect(output).rejects.toThrow(new Error('Invoice already exists'))
  })

  it('should find a invoice', async () => {
    // Arrange - Given
    const id1 = new Id()
    const id2 = new Id()

    await InvoiceModel.create(
      {
        id: id1.value,
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
        total: 10,
        items: [
          {
            id: new Id().value,
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

    await InvoiceModel.create(
      {
        id: id2.value,
        createdAt: new Date(),
        updatedAt: new Date(),
        name: 'Invoice 2',
        document: '123456788',
        street: 'Street 2',
        number: '123',
        complement: 'Complement 2',
        city: 'City 2',
        state: 'State 2',
        zipCode: '12345679',
        total: 40,
        items: [
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

    // Act - When
    const invoice1 = await repository.find(id1.value)
    const invoice2 = await repository.find(id2.value)

    // Assert - Then
    expect(invoice1).not.toBeNull()
    expect(invoice1.id).toStrictEqual(id1)
    expect(invoice1.createdAt).toBeDefined()
    expect(invoice1.updatedAt).toBeDefined()
    expect(invoice1.name).toBe('Invoice 1')
    expect(invoice1.document).toBe('123456789')
    expect(invoice1.address.street).toBe('Street 1')
    expect(invoice1.address.number).toBe('123')
    expect(invoice1.address.complement).toBe('Complement 1')
    expect(invoice1.address.zipCode).toBe('12345678')
    expect(invoice1.address.city).toBe('City 1')
    expect(invoice1.address.state).toBe('State 1')
    expect(invoice1.total).toBe(10)
    expect(invoice1.items).toHaveLength(1)
    expect(invoice1.items[0].id).toBeDefined()
    expect(invoice1.items[0].name).toBe('Product 1')
    expect(invoice1.items[0].price).toBe(10)
    expect(invoice1.items[0].quantity).toBe(1)
    expect(invoice1.items[0].total).toBe(10)

    expect(invoice2).not.toBeNull()
    expect(invoice2.id).toStrictEqual(id2)
    expect(invoice2.createdAt).toBeDefined()
    expect(invoice2.updatedAt).toBeDefined()
    expect(invoice2.name).toBe('Invoice 2')
    expect(invoice2.document).toBe('123456788')
    expect(invoice2.address.street).toBe('Street 2')
    expect(invoice2.address.number).toBe('123')
    expect(invoice2.address.complement).toBe('Complement 2')
    expect(invoice2.address.zipCode).toBe('12345679')
    expect(invoice2.address.city).toBe('City 2')
    expect(invoice2.address.state).toBe('State 2')
    expect(invoice2.total).toBe(40)
    expect(invoice2.items).toHaveLength(1)
    expect(invoice2.items[0].id).toBeDefined()
    expect(invoice2.items[0].name).toBe('Product 2')
    expect(invoice2.items[0].price).toBe(20)
    expect(invoice2.items[0].quantity).toBe(2)
    expect(invoice2.items[0].total).toBe(40)
  })

  it('should throw a Not Found error when trying to find a invoice that does not exist', async () => {
    // Arrange - Given
    const id = new Id()

    // Act - When
    const f = async () => {
      await repository.find(id.value)
    }

    // Assert - Then
    await expect(f()).rejects.toThrow(new Error('Invoice not found'))
  })
})
