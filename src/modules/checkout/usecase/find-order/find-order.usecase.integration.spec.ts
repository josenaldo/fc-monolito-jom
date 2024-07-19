import { Id } from '@/modules/@shared/domain/value-object/id.value-object'
import { Migrator } from '@/modules/@shared/test/migrator'
import { OrderStatus } from '@/modules/checkout/domain/entity/order.entity'
import { CheckoutGateway } from '@/modules/checkout/gateway/checkout.gateway'
import { ClientModel } from '@/modules/checkout/repository/client.model'
import OrderItemModel from '@/modules/checkout/repository/order-item.model'
import { OrderModel } from '@/modules/checkout/repository/order.model'
import { OrderRepository } from '@/modules/checkout/repository/order.repository'
import { CreateMigrator } from '@/modules/checkout/test/checkout.test.utils'
import { FindOrderUsecase } from '@/modules/checkout/usecase/find-order/find-order.usecase'

describe('Find Order usecase unit tests', () => {
  let migrator: Migrator

  let repository: CheckoutGateway
  let usecase: FindOrderUsecase
  let id: Id
  let clientId: string

  beforeEach(async () => {
    migrator = CreateMigrator()
    await migrator.up()
    repository = new OrderRepository()

    usecase = new FindOrderUsecase({ repository })

    clientId = new Id().value
    id = new Id()
    const now = new Date()

    await ClientModel.create({
      id: clientId,
      createdAt: new Date(),
      updatedAt: new Date(),
      name: 'John Doe',
      email: 'john@teste.com',
      document: '12345678900',
      street: 'Main Street',
      number: '10',
      complement: 'Near the park',
      city: 'New York',
      state: 'NY',
      zipcode: '12345678',
    })

    await OrderModel.create(
      {
        id: id.value,
        createdAt: now,
        updatedAt: now,
        status: OrderStatus.APPROVED,
        total: 250,
        clientId: clientId,
        items: [
          {
            id: new Id().value,
            createdAt: now,
            updatedAt: now,
            orderId: id.value,
            productId: new Id().value,
            quantity: 5,
            price: 10,
            total: 50,
          },
          {
            id: new Id().value,
            createdAt: now,
            updatedAt: now,
            orderId: id.value,
            productId: new Id().value,
            quantity: 10,
            price: 20,
            total: 200,
          },
        ],
      },
      {
        include: [OrderItemModel, ClientModel],
      }
    )
  })

  afterEach(async () => {
    await migrator.down()
  })

  it('should find order', async () => {
    // Arrange - Given

    // Act - When
    const result = await usecase.execute({ id: id.value })

    // Assert - Then
    expect(result).toBeDefined()
    expect(result.id).toBe(id.value)
    expect(result.clientId).toBe(clientId)
    expect(result.status).toBe(OrderStatus.APPROVED)
    expect(result.total).toBe(250)
    expect(result.items).toHaveLength(2)
    expect(result.items[0].productId).toBeDefined()
    expect(result.items[0].quantity).toBe(5)
    expect(result.items[0].price).toBe(10)
    expect(result.items[0].total).toBe(50)
    expect(result.items[1].productId).toBeDefined()
    expect(result.items[1].quantity).toBe(10)
    expect(result.items[1].price).toBe(20)
    expect(result.items[1].total).toBe
  })

  it('should throw error if order not found', async () => {
    // Arrange - Given
    const id = new Id().value

    // Act - When
    const result = usecase.execute({ id })

    // Assert - Then
    await expect(result).rejects.toThrow('Order not found')
  })
})
