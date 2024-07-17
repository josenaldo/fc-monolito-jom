import { Id } from '@/modules/@shared/domain/value-object/id.value-object'
import { Migrator } from '@/modules/@shared/test/migrator'
import { ProductGateway } from '@/modules/store-catalog/gateway/product.gateway'
import { ProductModel } from '@/modules/store-catalog/repository/product.model'
import { ProductRepository } from '@/modules/store-catalog/repository/product.repository'
import { CreateMigrator } from '@/modules/store-catalog/test/store-catalog.test.utils'
import { FindProductUsecase } from '@/modules/store-catalog/usecase/find-product/find-product.usecase'

describe('Find Product use case unit tests', () => {
  let migrator: Migrator
  let repository: ProductGateway
  let usecase: FindProductUsecase

  beforeEach(async () => {
    migrator = CreateMigrator()
    await migrator.up()

    repository = new ProductRepository()
    usecase = new FindProductUsecase(repository)
  })

  afterEach(async () => {
    await migrator.down()
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
    await expect(output).rejects.toThrow(new Error('Product not found'))
  })
})
