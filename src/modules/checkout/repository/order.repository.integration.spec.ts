import { Address } from '@/modules/@shared/domain/value-object/address'
import { Id } from '@/modules/@shared/domain/value-object/id.value-object'
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
import { OrderModel } from '@/modules/checkout/repository/order.model'
import { OrderRepository } from '@/modules/checkout/repository/order.repository'
import { CreateMigrator } from '@/modules/checkout/test/checkout.test.utils'

describe('Order Repository integration tests ', () => {
  let migrator: Migrator

  let repository: OrderRepository

  let client: Client
  let address: Address
  let item1: OrderItem
  let item2: OrderItem

  beforeEach(async () => {
    migrator = CreateMigrator()
    await migrator.up()

    repository = new OrderRepository()

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

    await ClientModel.create({
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
    })
  })

  afterEach(async () => {
    await migrator.down()
  })

  it('should create a order', async () => {
    // Arrange - Given
    const orderProps: OrderProps = {
      id: new Id(),
      createdAt: new Date(),
      updatedAt: new Date(),
      client: client,
      items: [item1, item2],
      status: OrderStatus.PENDING,
    }

    const order: Order = new Order(orderProps)

    // Act - When
    await repository.add(order)

    // Assert - Then
    const orderModel = await OrderModel.findOne({
      where: { id: order.id.value },
      include: [OrderItemModel, ClientModel],
    })

    expect(orderModel).not.toBeNull()
    expect(orderModel.id).toBe(order.id.value)
    expect(orderModel.createdAt).toBeDefined()
    expect(orderModel.updatedAt).toBeDefined()
    expect(orderModel.client.name).toBe(order.client.name)
    expect(orderModel.client.email).toBe(order.client.email)
    expect(orderModel.client.document).toBe(order.client.document)
    expect(orderModel.client.street).toBe(order.client.address.street)
    expect(orderModel.client.number).toBe(order.client.address.number)
    expect(orderModel.client.complement).toBe(order.client.address.complement)
    expect(orderModel.client.zipcode).toBe(order.client.address.zipcode)
    expect(orderModel.client.city).toBe(order.client.address.city)
    expect(orderModel.client.state).toBe(order.client.address.state)
    expect(orderModel.items).toHaveLength(2)
    expect(orderModel.items[0].id).toBe(item1.id.value)
    expect(orderModel.items[0].productId).toBe(item1.productId)
    expect(orderModel.items[0].price).toBe(item1.price)
    expect(orderModel.items[0].quantity).toBe(item1.quantity)
    expect(orderModel.items[1].id).toBe(item2.id.value)
    expect(orderModel.items[1].productId).toBe(item2.productId)
    expect(orderModel.items[1].price).toBe(item2.price)
    expect(orderModel.items[1].quantity).toBe(item2.quantity)
    expect(orderModel.status).toBe(order.status)
  })

  it('should not create an order with an existing id', async () => {
    // Arrange - Given
    const orderProps: OrderProps = {
      id: new Id(),
      createdAt: new Date(),
      updatedAt: new Date(),
      client: client,
      items: [item1, item2],
      status: OrderStatus.PENDING,
    }

    const order: Order = new Order(orderProps)

    // Act - When
    await repository.add(order)

    // Assert - Then
    await expect(repository.add(order)).rejects.toThrow('Order already exists')
  })

  it('should find a order', async () => {
    // Arrange - Given
    const orderProps: OrderProps = {
      id: new Id(),
      createdAt: new Date(),
      updatedAt: new Date(),
      client: client,
      items: [item1, item2],
      status: OrderStatus.PENDING,
    }

    const order: Order = new Order(orderProps)

    await repository.add(order)

    // Act - When
    const output = await repository.find(order.id.value)

    // Assert - Then
    expect(output).not.toBeNull()
    expect(output.id.value).toBe(order.id.value)
    expect(output.client.name).toBe(order.client.name)
    expect(output.client.email).toBe(order.client.email)
    expect(output.client.document).toBe(order.client.document)
    expect(output.client.address.street).toBe(order.client.address.street)
    expect(output.client.address.number).toBe(order.client.address.number)
    expect(output.client.address.complement).toBe(
      order.client.address.complement
    )
    expect(output.client.address.zipcode).toBe(order.client.address.zipcode)
    expect(output.client.address.city).toBe(order.client.address.city)
    expect(output.client.address.state).toBe(order.client.address.state)
    expect(output.items).toHaveLength(2)
    expect(output.items[0].id.value).toBe(item1.id.value)
    expect(output.items[0].productId).toBe(item1.productId)
    expect(output.items[0].price).toBe(item1.price)
    expect(output.items[0].quantity).toBe(item1.quantity)
    expect(output.items[1].id.value).toBe(item2.id.value)
    expect(output.items[1].productId).toBe(item2.productId)
    expect(output.items[1].price).toBe(item2.price)
    expect(output.items[1].quantity).toBe(item2.quantity)
    expect(output.status).toBe(order.status)
  })

  it('should thorw a Not Found Error when trying to find a non-existing order', async () => {
    // Arrange - Given
    const id = new Id()

    // Act - When
    const output = repository.find(id.value)

    // Assert - Then
    await expect(output).rejects.toThrow('Order not found')
  })
})
