import { Address } from '@/modules/@shared/domain/value-object/address'
import { Id } from '@/modules/@shared/domain/value-object/id.value-object'
import { DomainToModelMapperInterface } from '@/modules/@shared/repository/domain-to-model-mapper.interface'
import { Migrator } from '@/modules/@shared/test/migrator'
import { InvoiceItem } from '@/modules/invoice/domain/entity/invoice-item.entity'
import {
  Invoice,
  InvoiceProps,
} from '@/modules/invoice/domain/entity/invoice.entity'
import InvoiceItemModel from '@/modules/invoice/repository/invoice-item.model'
import { InvoiceModelToInvoiceMapper } from '@/modules/invoice/repository/invoice-model-to-invoice.mapper'
import { InvoiceModel } from '@/modules/invoice/repository/invoice.model'
import { CreateMigrator } from '@/modules/invoice/test/invoice.test.utils'

describe('InvoiceModelToInvoiceMapper unit tests', () => {
  let migrator: Migrator
  let mapper: DomainToModelMapperInterface<Invoice, InvoiceModel>

  beforeEach(async () => {
    migrator = CreateMigrator()
    await migrator.up()

    mapper = new InvoiceModelToInvoiceMapper()
  })

  afterEach(async () => {
    await migrator.down()
  })

  it('should map InvoiceModel to Invoice', async () => {
    const id: Id = new Id()

    const model: InvoiceModel = new InvoiceModel(
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

    const domain = mapper.toDomain(model)

    expect(domain).toBeInstanceOf(Invoice)
    expect(domain).not.toBeNull()
    expect(domain.id).toStrictEqual(id)
    expect(domain.createdAt).toBeDefined()
    expect(domain.updatedAt).toBeDefined()
    expect(domain.name).toBe('Invoice 1')
    expect(domain.document).toBe('123456789')
    expect(domain.address.street).toBe('Street 1')
    expect(domain.address.number).toBe('123')
    expect(domain.address.complement).toBe('Complement 1')
    expect(domain.address.zipcode).toBe('12345678')
    expect(domain.address.city).toBe('City 1')
    expect(domain.address.state).toBe('State 1')
    expect(domain.total).toBe(10)
    expect(domain.items).toHaveLength(1)
    expect(domain.items[0].id).toBeDefined()
    expect(domain.items[0].id).toBeInstanceOf(Id)
    expect(domain.items[0].name).toBe('Product 1')
    expect(domain.items[0].price).toBe(10)
    expect(domain.items[0].quantity).toBe(1)
    expect(domain.items[0].total).toBe(10)
  })

  it('should map Invoice to InvoiceModel', () => {
    const id: Id = new Id()

    const address = new Address({
      street: 'Street 1',
      number: '123',
      complement: 'Complement 1',
      city: 'City 1',
      state: 'State 1',
      zipcode: '12345678',
    })

    const item1 = new InvoiceItem({
      id: new Id(),
      name: 'Product 1',
      price: 10,
      quantity: 1,
    })

    const item2 = new InvoiceItem({
      id: new Id(),
      name: 'Product 2',
      price: 20,
      quantity: 2,
    })

    const invoiceProps: InvoiceProps = {
      id: id,
      createdAt: new Date(),
      updatedAt: new Date(),
      name: 'Invoice 1',
      document: '123456789',
      address: address,
      items: [item1, item2],
    }

    const domain = new Invoice(invoiceProps)

    const model = mapper.toModel(domain)

    expect(model).not.toBeNull()
    expect(model.id).toBe(domain.id.value)
    expect(model.createdAt).toBeDefined()
    expect(model.updatedAt).toBeDefined()
    expect(model.name).toBe(domain.name)
    expect(model.document).toBe(domain.document)
    expect(model.street).toBe(domain.address.street)
    expect(model.number).toBe(domain.address.number)
    expect(model.complement).toBe(domain.address.complement)
    expect(model.zipcode).toBe(domain.address.zipcode)
    expect(model.city).toBe(domain.address.city)
    expect(model.state).toBe(domain.address.state)
    expect(model.total).toBe(domain.total)
    expect(model.items).toHaveLength(2)
    expect(model.items[0].id).toBe(item1.id.value)
    expect(model.items[0].name).toBe(item1.name)
    expect(model.items[0].price).toBe(item1.price)
    expect(model.items[0].quantity).toBe(item1.quantity)
    expect(model.items[0].total).toBe(item1.total)
    expect(model.items[1].id).toBe(item2.id.value)
    expect(model.items[1].name).toBe(item2.name)
    expect(model.items[1].price).toBe(item2.price)
    expect(model.items[1].quantity).toBe(item2.quantity)
    expect(model.items[1].total).toBe(item2.total)
  })
})
