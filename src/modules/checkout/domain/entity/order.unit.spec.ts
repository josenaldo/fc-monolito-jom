import { Id } from '@/modules/@shared/domain/value-object/id.value-object'
import { Client } from '@/modules/checkout/domain/entity/client.entity'
import { OrderItem } from '@/modules/checkout/domain/entity/order-item.entity'
import {
  Order,
  OrderProps,
  OrderStatus,
} from '@/modules/checkout/domain/entity/order.entity'

describe('Order unit tests', () => {
  let props: OrderProps

  beforeEach(() => {
    const client: Client = new Client({
      name: 'John Doe',
      email: 'john@doe.com',
      address:
        'Fake Street, 123, Fake Complement, 111111-111, Fake City, Fake State',
    })

    const item1 = new OrderItem({
      productId: new Id().value,
      quantity: 2,
      price: 100,
    })

    const item2 = new OrderItem({
      productId: new Id().value,
      quantity: 3,
      price: 150,
    })

    props = {
      client,
      items: [item1, item2],
      status: OrderStatus.PENDING,
    }
  })

  it('should create an order instance', () => {
    // Arrange - Given

    // Act - When
    const output = new Order(props)

    // Assert - Then
    expect(output).toBeInstanceOf(Order)
    expect(output.client).toBe(props.client)
    expect(output.items).toBe(props.items)
    expect(output.status).toBe(props.status)
    expect(output.total).toBe(650)
  })

  it('should approve the order', () => {
    // Arrange - Given
    const order = new Order(props)

    // Act - When
    order.approve()

    // Assert - Then
    expect(order.status).toBe(OrderStatus.APPROVED)
  })

  it('should cancel the order', () => {
    // Arrange - Given
    const order = new Order(props)

    // Act - When
    order.cancel()

    // Assert - Then
    expect(order.status).toBe(OrderStatus.CANCELLED)
  })

  it('should throw an error if client is empty', () => {
    // Arrange - Given
    props.client = undefined

    // Act - When
    const output = () => new Order(props)

    // Assert - Then
    expect(output).toThrow('checkout/order: Client is required')
  })

  it('should throw an error if items are empty', () => {
    // Arrange - Given
    props.items = []

    // Act - When
    const output = () => new Order(props)

    // Assert - Then
    expect(output).toThrow('checkout/order: Items are required')
  })

  it('should throw an error if trying to approve an already approved order', () => {
    // Arrange - Given
    const order = new Order(props)
    order.approve()

    // Act - When
    const output = () => order.approve()

    // Assert - Then
    expect(output).toThrow('checkout/order: Order already approved')
  })

  it('should throw an error if trying to approve an already cancelled order', () => {
    // Arrange - Given
    const order = new Order(props)
    order.cancel()

    // Act - When
    const output = () => order.approve()

    // Assert - Then
    expect(output).toThrow('checkout/order: Order already cancelled')
  })

  it('should throw an error if trying to cancel an already cancelled order', () => {
    // Arrange - Given
    const order = new Order(props)
    order.cancel()

    // Act - When
    const output = () => order.cancel()

    // Assert - Then
    expect(output).toThrow('checkout/order: Order already cancelled')
  })

  it('should throw an error if trying to cancel an already approved order', () => {
    // Arrange - Given
    const order = new Order(props)
    order.approve()

    // Act - When
    const output = () => order.cancel()

    // Assert - Then
    expect(output).toThrow('checkout/order: Order already approved')
  })
})
