import { Id } from '@/modules/@shared/domain/value-object/id.value-object'
import {
  Product,
  ProductProps,
} from '@/modules/store-catalog/domain/entity/product.entity'

describe('Product unit tests', () => {
  let props: ProductProps

  beforeEach(async () => {
    props = {
      id: new Id(),
      createdAt: new Date(),
      updatedAt: new Date(),
      name: 'Product Name',
      description: 'Product Description',
      salesPrice: 9.99,
    }
  })

  it('should create a valid product', () => {
    // Arrange - Given
    // Act - When
    const output = new Product(props)

    // Assert - Then
    expect(output).toBeInstanceOf(Product)
    expect(output.id).not.toBeNull()
    expect(output.createdAt).not.toBeNull()
    expect(output.updatedAt).not.toBeNull()
    expect(output.name).toBe(props.name)
    expect(output.description).toBe(props.description)
    expect(output.salesPrice).toBe(props.salesPrice)
  })

  it('should throw a notification error if name is not empty', () => {
    // Arrange - Given
    props.name = ''

    // Act - When
    const output = () => new Product(props)

    // Assert - Then
    expect(output).toThrow(new Error('store-catalog/product: Name is required'))
  })

  it('should throw a notification error if description is not empty', () => {
    // Arrange - Given
    props.description = ''

    // Act - When
    const output = () => new Product(props)

    // Assert - Then
    expect(output).toThrow(
      new Error('store-catalog/product: Description is required')
    )
  })

  it('should throw a notification error if salesPrice is not empty', () => {
    // Arrange - Given
    props.salesPrice = 0

    // Act - When
    const output = () => new Product(props)

    // Assert - Then
    expect(output).toThrow(
      new Error('store-catalog/product: Price is required')
    )
  })

  it('should throw a notification error if salesPrice is not greater than zero', () => {
    // Arrange - Given
    props.salesPrice = -1

    // Act - When
    const output = () => new Product(props)

    // Assert - Then
    expect(output).toThrow(
      new Error('store-catalog/product: Sales Price must be greater than zero')
    )
  })
})
