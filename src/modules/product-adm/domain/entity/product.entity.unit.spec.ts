import {
  Product,
  ProductProps,
} from '@/modules/product-adm/domain/entity/product.entity'

describe('Product unit tests', () => {
  let props: ProductProps

  beforeEach(async () => {
    props = {
      name: 'Product Name',
      description: 'Product Description',
      purchasePrice: 9.99,
      stock: 10,
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
    expect(output.purchasePrice).toBe(props.purchasePrice)
    expect(output.stock).toBe(props.stock)
  })

  it('should throw a notification error if name is not empty', () => {
    // Arrange - Given
    props.name = ''

    // Act - When
    const output = () => new Product(props)

    // Assert - Then
    expect(output).toThrow(new Error('product-adm/product: Name is required'))
  })

  it('should throw a notification error if description is not empty', () => {
    // Arrange - Given
    props.description = ''

    // Act - When
    const output = () => new Product(props)

    // Assert - Then
    expect(output).toThrow(
      new Error('product-adm/product: Description is required')
    )
  })

  it('should throw a notification error if purchasePrice is not empty', () => {
    // Arrange - Given
    props.purchasePrice = 0

    // Act - When
    const output = () => new Product(props)

    // Assert - Then
    expect(output).toThrow(
      new Error(
        'product-adm/product: Purchase Price must be greater than or equal to 0'
      )
    )
  })

  it('should throw a notification error if purchasePrice is not greater than zero', () => {
    // Arrange - Given
    props.purchasePrice = -1

    // Act - When
    const output = () => new Product(props)

    // Assert - Then
    expect(output).toThrow(
      new Error(
        'product-adm/product: Purchase Price must be greater than or equal to 0'
      )
    )
  })

  it('should create a Product with zero stock', () => {
    // Arrange - Given
    props.stock = 0

    // Act - When
    const output = new Product(props)

    // Assert - Then
    expect(output).toBeInstanceOf(Product)
    expect(output.id).not.toBeNull()
    expect(output.createdAt).not.toBeNull()
    expect(output.updatedAt).not.toBeNull()
    expect(output.name).toBe(props.name)
    expect(output.description).toBe(props.description)
    expect(output.purchasePrice).toBe(props.purchasePrice)
    expect(output.stock).toBe(props.stock)
  })

  it('should throw a notification error if stock is not greater than zero', () => {
    // Arrange - Given
    props.stock = -1

    // Act - When
    const output = () => new Product(props)

    // Assert - Then
    expect(output).toThrow(
      new Error('product-adm/product: Stock must be greater than 0')
    )
  })
})
