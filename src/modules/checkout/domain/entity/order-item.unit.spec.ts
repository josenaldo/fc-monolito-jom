import { Id } from '@/modules/@shared/domain/value-object/id.value-object'
import {
  OrderItem,
  OrderItemProps,
} from '@/modules/checkout/domain/entity/order-item.entity'

describe('Order Item unit tests', () => {
  let props: OrderItemProps

  beforeEach(() => {
    props = {
      productId: new Id().value,
      quantity: 2,
      price: 100,
    }
  })

  it('should create an order item instance', () => {
    // Arrange - Given

    // Act - When
    const output = new OrderItem(props)

    // Assert - Then
    expect(output).toBeInstanceOf(OrderItem)
    expect(output.productId).toBe(props.productId)
    expect(output.quantity).toBe(props.quantity)
    expect(output.price).toBe(props.price)
    expect(output.total).toBe(props.quantity * props.price)
  })

  it('should throw an error if product id is not provided', () => {
    // Arrange - Given
    props.productId = ''

    // Act - When
    const output = () => new OrderItem(props)

    // Assert - Then
    expect(output).toThrow('checkout/order-item: Product is required')
  })

  it('should throw an error if quantity is not greater than zero', () => {
    // Arrange - Given
    props.quantity = 0

    // Act - When
    const output = () => new OrderItem(props)

    // Assert - Then
    expect(output).toThrow(
      'checkout/order-item: Quantity must be greater than zero'
    )
  })

  it('should throw an error if price is not greater than zero', () => {
    // Arrange - Given
    props.price = 0

    // Act - When
    const output = () => new OrderItem(props)

    // Assert - Then
    expect(output).toThrow(
      'checkout/order-item: Price must be greater than zero'
    )
  })
})
