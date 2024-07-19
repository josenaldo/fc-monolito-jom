import { Address } from '@/modules/@shared/domain/value-object/address'
import { Id } from '@/modules/@shared/domain/value-object/id.value-object'
import { Client } from '@/modules/checkout/domain/entity/client.entity'
import { OrderItem } from '@/modules/checkout/domain/entity/order-item.entity'
import {
  Order,
  OrderProps,
  OrderStatus,
} from '@/modules/checkout/domain/entity/order.entity'
import { CheckoutGateway } from '@/modules/checkout/gateway/checkout.gateway'
import { CreateMockRepository } from '@/modules/checkout/test/checkout.test.utils'
import { FindOrderUsecase } from '@/modules/checkout/usecase/find-order/find-order.usecase'

describe('Find Order usecase unit tests', () => {
  let repository: CheckoutGateway
  let usecase: FindOrderUsecase

  beforeEach(async () => {
    repository = CreateMockRepository()

    usecase = new FindOrderUsecase({ repository })
  })

  afterEach(async () => {})

  it('should find order', async () => {
    // Arrange - Given
    const address: Address = new Address({
      street: 'street',
      number: 'number',
      complement: 'complement',
      city: 'city',
      state: 'state',
      zipcode: 'zipCode',
    })

    const client: Client = new Client({
      id: new Id(),
      name: 'client',
      document: '12345678900',
      email: 'cliente@teste.com',
      address: address,
    })

    const item1: OrderItem = new OrderItem({
      productId: new Id().value,
      quantity: 2,
      price: 20,
    })

    const item2: OrderItem = new OrderItem({
      productId: new Id().value,
      quantity: 1,
      price: 10,
    })

    const id = new Id()
    const orderProps: OrderProps = {
      id: id,
      createdAt: new Date(),
      updatedAt: new Date(),
      client: client,
      status: OrderStatus.APPROVED,
      items: [item1, item2],
    }

    const expectedOrder = new Order(orderProps)

    repository.find = jest.fn().mockResolvedValue(expectedOrder)

    // Act - When
    const result = await usecase.execute({ id: id.value })

    // Assert - Then
    expect(result).toBeDefined()
    expect(result.id).toBe(id.value)
    expect(result.clientId).toBe(client.id.value)
    expect(result.status).toBe(OrderStatus.APPROVED)
    expect(result.total).toBe(50)
    expect(result.items).toHaveLength(2)
    expect(result.items[0].productId).toBe(item1.productId)
    expect(result.items[0].quantity).toBe(item1.quantity)
    expect(result.items[0].price).toBe(item1.price)
    expect(result.items[0].total).toBe(item1.total)
    expect(result.items[1].productId).toBe(item2.productId)
    expect(result.items[1].quantity).toBe(item2.quantity)
    expect(result.items[1].price).toBe(item2.price)
    expect(result.items[1].total).toBe
  })

  it('should throw error if order not found', async () => {})
})
