import { Address } from '@/modules/@shared/domain/value-object/address'
import { Id } from '@/modules/@shared/domain/value-object/id.value-object'
import { DomainToModelMapperInterface } from '@/modules/@shared/repository/domain-to-model-mapper.interface'
import { Migrator } from '@/modules/@shared/test/migrator'
import { Client } from '@/modules/checkout/domain/entity/client.entity'
import { OrderItem } from '@/modules/checkout/domain/entity/order-item.entity'
import {
  Order,
  OrderProps,
  OrderStatus,
} from '@/modules/checkout/domain/entity/order.entity'
import { ClientModel } from '@/modules/checkout/repository/client.model'
import OrderItemModel from '@/modules/checkout/repository/order-item.model'
import { OrderModelToOrderMapper } from '@/modules/checkout/repository/order-model-to-order.mapper'
import { OrderModel } from '@/modules/checkout/repository/order.model'
import { CreateMigrator } from '@/modules/checkout/test/checkout.test.utils'

describe('OrderModelToOrderMapper unit tests', () => {
  let migrator: Migrator
  let mapper: DomainToModelMapperInterface<Order, OrderModel>

  let client: Client
  let address: Address
  let item1: OrderItem
  let item2: OrderItem

  beforeEach(async () => {
    migrator = CreateMigrator()
    await migrator.up()

    mapper = new OrderModelToOrderMapper()

    address = new Address({
      street: 'Street 1',
      number: '123',
      complement: 'Complement 1',
      city: 'City 1',
      state: 'State 1',
      zipcode: '12345678',
    })

    client = new Client({
      id: new Id(),
      createdAt: new Date(),
      updatedAt: new Date(),
      name: 'Client 1',
      email: 't@t.com',
      document: '12345678900',
      address: address,
    })

    item1 = new OrderItem({
      id: new Id(),
      productId: new Id().value,
      price: 10,
      quantity: 1,
    })

    item2 = new OrderItem({
      id: new Id(),
      productId: new Id().value,
      price: 20,
      quantity: 2,
    })
  })

  afterEach(async () => {
    await migrator.down()
  })

  it('should map OrderModel to Order', async () => {
    const id: Id = new Id()

    const model: OrderModel = new OrderModel(
      {
        id: id.value,
        createdAt: new Date(),
        updatedAt: new Date(),
        clientId: client.id.value,
        client: {
          id: client.id.value,
          createdAt: client.createdAt,
          updatedAt: client.updatedAt,
          name: client.name,
          email: client.email,
          document: client.document,
          street: client.address.street,
          number: client.address.number,
          complement: client.address.complement,
          zipcode: client.address.zipcode,
          city: client.address.city,
          state: client.address.state,
        },
        status: OrderStatus.PENDING,
        total: 50,
        items: [item1, item2].map((item) => {
          return {
            id: item.id.value,
            productId: item.productId,
            price: item.price,
            quantity: item.quantity,
            total: item.total,
          }
        }),
      },
      {
        include: [OrderItemModel, ClientModel],
      }
    )

    const domain = mapper.toDomain(model)

    expect(domain).toBeInstanceOf(Order)
    expect(domain).not.toBeNull()
    expect(domain.id).toStrictEqual(id)
    expect(domain.createdAt).toBeDefined()
    expect(domain.updatedAt).toBeDefined()
    expect(domain.client.id).toStrictEqual(client.id)
    expect(domain.client.createdAt).toStrictEqual(client.createdAt)
    expect(domain.client.updatedAt).toStrictEqual(client.updatedAt)
    expect(domain.client.name).toBe(client.name)
    expect(domain.client.email).toBe(client.email)
    expect(domain.client.document).toBe(client.document)
    expect(domain.client.address.street).toBe(client.address.street)
    expect(domain.client.address.number).toBe(client.address.number)
    expect(domain.client.address.complement).toBe(client.address.complement)
    expect(domain.client.address.zipcode).toBe(client.address.zipcode)
    expect(domain.client.address.city).toBe(client.address.city)
    expect(domain.client.address.state).toBe(client.address.state)
    expect(domain.total).toBe(50)
    expect(domain.items).toHaveLength(2)
    expect(domain.items[0].id).toBeDefined()
    expect(domain.items[0].id).toBeInstanceOf(Id)
    expect(domain.items[0].price).toBe(10)
    expect(domain.items[0].quantity).toBe(1)
    expect(domain.items[0].total).toBe(10)
    expect(domain.items[1].id).toBeDefined()
    expect(domain.items[1].id).toBeInstanceOf(Id)
    expect(domain.items[1].price).toBe(20)
    expect(domain.items[1].quantity).toBe(2)
    expect(domain.items[1].total).toBe
  })

  it('should map Order to OrderModel', () => {
    const id: Id = new Id()

    const address = new Address({
      street: 'Street 1',
      number: '123',
      complement: 'Complement 1',
      city: 'City 1',
      state: 'State 1',
      zipcode: '12345678',
    })

    const client = new Client({
      id: new Id(),
      createdAt: new Date(),
      updatedAt: new Date(),
      name: 'Client 1',
      email: 't@t.com',
      document: '12345678900',
      address: address,
    })

    const item1 = new OrderItem({
      id: new Id(),
      productId: new Id().value,
      price: 10,
      quantity: 1,
    })

    const item2 = new OrderItem({
      id: new Id(),
      productId: new Id().value,
      price: 20,
      quantity: 2,
    })

    const invoiceProps: OrderProps = {
      id: id,
      createdAt: new Date(),
      updatedAt: new Date(),
      client: client,
      status: OrderStatus.PENDING,
      items: [item1, item2],
    }

    const domain = new Order(invoiceProps)

    const model = mapper.toModel(domain)

    expect(model).not.toBeNull()
    expect(model.id).toBe(domain.id.value)
    expect(model.createdAt).toBeDefined()
    expect(model.updatedAt).toBeDefined()
    expect(model.clientId).toBe(domain.client.id.value)
    expect(model.status).toBe(domain.status)
    expect(model.items).toHaveLength(2)
    expect(model.items[0].id).toBe(domain.items[0].id.value)
    expect(model.items[0].productId).toBe(domain.items[0].productId)
    expect(model.items[0].price).toBe(domain.items[0].price)
    expect(model.items[0].quantity).toBe(domain.items[0].quantity)
    expect(model.items[1].id).toBe(domain.items[1].id.value)
    expect(model.items[1].productId).toBe(domain.items[1].productId)
    expect(model.items[1].price).toBe(domain.items[1].price)
    expect(model.items[1].quantity).toBe(domain.items[1].quantity)
  })
})
