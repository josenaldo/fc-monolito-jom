import { Id } from '@/modules/@shared/domain/value-object/id.value-object'
import { ProductGateway } from '@/modules/store-catalog/gateway/product.gateway'
import { ProductModel } from '@/modules/store-catalog/repository/product.model'
import { ProductRepository } from '@/modules/store-catalog/repository/product.repository'
import { CreateSequelizeWithModels } from '@/modules/store-catalog/test/test.utils'
import { FindProductUsecase } from '@/modules/store-catalog/usecase/find-product/find-product.usecase'
import { Sequelize } from 'sequelize-typescript'

describe('Find Product use case unit tests', () => {
  let sequelize: Sequelize
  let repository: ProductGateway
  let usecase: FindProductUsecase

  beforeEach(async () => {
    sequelize = await CreateSequelizeWithModels([ProductModel])

    repository = new ProductRepository()
    usecase = new FindProductUsecase(repository)
  })

  afterEach(async () => {
    await sequelize.close()
  })

  it('should find a product', async () => {
    // Arrange - Given
    const id = new Id()

    await ProductModel.create({
      id: id.value,
      createdAt: new Date(),
      updatedAt: new Date(),
      name: 'product',
      description: 'description',
      salesPrice: 10,
    })

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

    const id = new Id()
    // Act - When
    const output = usecase.execute({ id: id.value })

    // Assert - Then
    await expect(output).rejects.toThrow('Product not found')
  })
})
