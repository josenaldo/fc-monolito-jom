import { Id } from '@/modules/@shared/domain/value-object/id.value-object'
import { Migrator } from '@/modules/@shared/test/migrator'
import { ProductGateway } from '@/modules/store-catalog/gateway/product.gateway'
import { ProductModel } from '@/modules/store-catalog/repository/product.model'
import { ProductRepository } from '@/modules/store-catalog/repository/product.repository'
import { CreateMigrator } from '@/modules/store-catalog/test/store-catalog.test.utils'
import { FindAllProductsUsecaseOutputDto } from '@/modules/store-catalog/usecase/find-all-products/find-all-products.dto'
import { FindAllProductsUsecase } from '@/modules/store-catalog/usecase/find-all-products/find-all-products.usecase'

describe('Find All Products Usecase unit tests', () => {
  let migrator: Migrator
  let repository: ProductGateway
  let usecase: FindAllProductsUsecase

  beforeEach(async () => {
    migrator = CreateMigrator()
    await migrator.up()

    repository = new ProductRepository()
    usecase = new FindAllProductsUsecase(repository)
  })

  afterEach(async () => {
    await migrator.down()
  })

  it('should find all products', async () => {
    // Arrange - Given

    const id1 = new Id()
    const id2 = new Id()

    await ProductModel.create({
      id: id1.value,
      createdAt: new Date(),
      updatedAt: new Date(),
      name: 'product',
      description: 'description',
      salesPrice: 10,
    })

    await ProductModel.create({
      id: id2.value,
      createdAt: new Date(),
      updatedAt: new Date(),
      name: 'product2',
      description: 'description2',
      salesPrice: 20,
    })

    // Act - When
    const output: FindAllProductsUsecaseOutputDto = await usecase.execute()

    // Assert - Then
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

    // Act - When
    const output: FindAllProductsUsecaseOutputDto = await usecase.execute()

    // Assert - Then
    expect(output).toBeDefined()
    expect(output.totalCount).toBe(0)
    const products = output.products
    expect(products).toBeDefined()
    expect(products.length).toBe(0)
  })
})
