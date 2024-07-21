import { app } from '@/infrastructure/app-config'
import { CreateE2EMigrator } from '@/infrastructure/test.utils'
import { Id } from '@/modules/@shared/domain/value-object/id.value-object'
import { Migrator } from '@/modules/@shared/test/migrator'
import InvoiceItemModel from '@/modules/invoice/repository/invoice-item.model'
import { InvoiceModel } from '@/modules/invoice/repository/invoice.model'
import supertest from 'supertest'
import TestAgent from 'supertest/lib/agent.js'

describe('Invoice E2E tests', () => {
  let migrator: Migrator
  let request: TestAgent
  let id: Id

  beforeEach(async () => {
    migrator = CreateE2EMigrator()
    await migrator.up()
    request = supertest(app)

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
        total: 50,
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
          {
            id: new Id().value,
            createdAt: new Date(),
            updatedAt: new Date(),
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
    await migrator.down()
  })

  it('should find a invoice', async () => {
    // Arrange - Given

    // Act - When
    const response = await request.get(`/invoices/${id.value}`)

    // Assert - Then
    expect(response.status).toBe(200)
    expect(response.body).toBeDefined()

    const invoice = response.body

    expect(invoice.id).toBe(id.value)
    expect(invoice.createdAt).toBeDefined()
    expect(invoice.updatedAt).toBeDefined()
    expect(invoice.name).toBe('Invoice 1')
    expect(invoice.document).toBe('123456789')
    expect(invoice.total).toBe(50)
    expect(invoice.address).toBeDefined()
    expect(invoice.address.street).toBe('Street 1')
    expect(invoice.address.number).toBe('123')
    expect(invoice.address.complement).toBe('Complement 1')
    expect(invoice.address.city).toBe('City 1')
    expect(invoice.address.state).toBe('State 1')
    expect(invoice.address.zipcode).toBe('12345678')
    expect(invoice.items).toBeDefined()
    expect(invoice.items.length).toBe(2)
    expect(invoice.items[0].id).toBeDefined()
    expect(invoice.items[0].name).toBe('Product 1')
    expect(invoice.items[0].price).toBe(10)
    expect(invoice.items[0].quantity).toBe(1)
    expect(invoice.items[0].total).toBe(10)
    expect(invoice.items[1].id).toBeDefined()
    expect(invoice.items[1].name).toBe('Product 2')
    expect(invoice.items[1].price).toBe(20)
    expect(invoice.items[1].quantity).toBe(2)
    expect(invoice.items[1].total).toBe(40)
  })

  it('should throw a Not Found error when trying to find a invoice that does not exist', async () => {
    // Arrange - Given
    const notFoundId = new Id()

    // Act - When
    const response = await request.get(`/invoices/${notFoundId.value}`)

    // Assert - Then
    expect(response.status).toBe(404)
    expect(response.body).toBeDefined()
    expect(response.body.error).toBe('Invoice not found')
  })
})
