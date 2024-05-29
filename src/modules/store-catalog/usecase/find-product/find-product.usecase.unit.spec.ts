import { Id } from '@/modules/@shared/domain/value-object/id.value-object'
import { Product } from '@/modules/store-catalog/domain/product.entity'
import { ProductGateway } from '@/modules/store-catalog/gateway/product.gateway'
import { CreateMockRepository } from '@/modules/store-catalog/test/test.utils'
import { FindProductUsecase } from '@/modules/store-catalog/usecase/find-product/find-product.usecase'

describe('Find Product use case unit tests', () => {
  let repository: ProductGateway
  let usecase: FindProductUsecase

  let product: Product
  let id: Id

  beforeEach(() => {
    repository = CreateMockRepository()
    usecase = new FindProductUsecase(repository)

    id = new Id()

    product = new Product({
      id: id,
      createdAt: new Date(),
      updatedAt: new Date(),
      name: 'product',
      description: 'description',
      salesPrice: 10,
    })
  })

  afterEach(() => {})

  it('should find a product', async () => {
    // Arrange - Given
    repository.find = jest.fn().mockResolvedValue(product)

    // Act - When
    const result = await usecase.execute({ id: id.value })

    // Assert - Then
    expect(result).toBeDefined()
    expect(result.id).toBe(id.value)
    expect(result.createdAt).toBeInstanceOf(Date)
    expect(result.updatedAt).toBeInstanceOf(Date)
    expect(result.name).toBe('product')
    expect(result.description).toBe('description')
    expect(result.salesPrice).toBe(10)
  })

  it('should throw an error when product is not found', async () => {
    // Arrange - Given
    repository.find = jest
      .fn()
      .mockRejectedValue(new Error('Product not found'))

    // Act - When
    const output = usecase.execute({ id: id.value })

    // Assert - Then
    await expect(output).rejects.toThrow(new Error('Product not found'))
  })
})
