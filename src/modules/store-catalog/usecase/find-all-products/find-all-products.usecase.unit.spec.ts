import { Id } from '@/modules/@shared/domain/value-object/id.value-object'
import { Product } from '@/modules/store-catalog/domain/entity/product.entity'
import { ProductGateway } from '@/modules/store-catalog/gateway/product.gateway'
import { CreateMockRepository } from '@/modules/store-catalog/test/store-catalog.test.utils'
import { FindAllProductsOutputDto } from '@/modules/store-catalog/usecase/find-all-products/find-all-products.dto'
import { FindAllProductsUsecase } from '@/modules/store-catalog/usecase/find-all-products/find-all-products.usecase'

describe('Find All Products Usecase unit tests', () => {
  let repository: ProductGateway
  let usecase: FindAllProductsUsecase

  let product1: Product
  let product2: Product
  let id1: Id
  let id2: Id

  beforeEach(() => {
    repository = CreateMockRepository()
    usecase = new FindAllProductsUsecase(repository)

    id1 = new Id()
    id2 = new Id()

    product1 = new Product({
      id: id1,
      createdAt: new Date(),
      updatedAt: new Date(),
      name: 'product',
      description: 'description',
      salesPrice: 10,
    })

    product2 = new Product({
      id: id2,
      createdAt: new Date(),
      updatedAt: new Date(),
      name: 'product2',
      description: 'description2',
      salesPrice: 20,
    })
  })

  afterEach(() => {})

  it('should find all products', async () => {
    // Arrange - Given
    repository.findAll = jest.fn().mockResolvedValue([product1, product2])

    // Act - When
    const output: FindAllProductsOutputDto = await usecase.execute()

    // Assert - Then
    expect(repository.findAll).toHaveBeenCalledTimes(1)

    expect(output).toBeDefined()
    expect(output.totalCount).toBe(2)
    const products = output.products
    expect(products).toBeDefined()
    expect(products.length).toBe(2)
    expect(products[0].id).toBe(id1.value)
    expect(products[0].name).toBe('product')
    expect(products[0].description).toBe('description')
    expect(products[0].salesPrice).toBe(10)
    expect(products[1].id).toBe(id2.value)
    expect(products[1].name).toBe('product2')
    expect(products[1].description).toBe('description2')
    expect(products[1].salesPrice).toBe(20)
  })

  it('should return empty array when there are no products', async () => {
    // Arrange - Given
    repository.findAll = jest.fn().mockResolvedValue([])

    // Act - When
    const output: FindAllProductsOutputDto = await usecase.execute()

    // Assert - Then
    expect(repository.findAll).toHaveBeenCalledTimes(1)

    expect(output).toBeDefined()
    expect(output.totalCount).toBe(0)
    const products = output.products
    expect(products).toBeDefined()
    expect(products.length).toBe(0)
  })
})
