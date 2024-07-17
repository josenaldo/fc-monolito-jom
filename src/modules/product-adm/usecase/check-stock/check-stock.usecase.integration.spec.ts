import { Id } from '@/modules/@shared/domain/value-object/id.value-object'
import { Migrator } from '@/modules/@shared/test/migrator'
import { ProductModel } from '@/modules/product-adm/repository/product.model'
import { ProductRepository } from '@/modules/product-adm/repository/product.repository'
import { CreateMigrator } from '@/modules/product-adm/test/product-adm.test.utils'
import {
  CheckStockUsecaseInputDto,
  CheckStockUsecaseOutputDto,
} from '@/modules/product-adm/usecase/check-stock/check-stock.dto'
import { CheckStockUsecase } from '@/modules/product-adm/usecase/check-stock/check-stock.usecase'

describe('Check Stock usecase unit tests', () => {
  let migrator: Migrator
  let repository: ProductRepository
  let usecase: CheckStockUsecase
  let id1: Id
  let id2: Id

  beforeEach(async () => {
    migrator = CreateMigrator()
    await migrator.up()

    repository = new ProductRepository()
    usecase = new CheckStockUsecase(repository)

    id1 = new Id()
    id2 = new Id()

    await ProductModel.create({
      id: id1.value,
      createdAt: new Date(),
      updatedAt: new Date(),
      name: 'Product 1',
      description: 'Description 1',
      purchasePrice: 10,
      salesPrice: 20,
      stock: 10,
    })

    await ProductModel.create({
      id: id2.value,
      createdAt: new Date(),
      updatedAt: new Date(),
      name: 'Product 2',
      description: 'Description 2',
      purchasePrice: 20,
      salesPrice: 40,
      stock: 20,
    })
  })

  afterEach(async () => {
    await migrator.down()
  })

  it('should check stock', async () => {
    // Arrange - Given
    const input: CheckStockUsecaseInputDto = { productId: id1.value }

    // Act - When
    const output: CheckStockUsecaseOutputDto = await usecase.execute(input)

    // Assert - Then
    expect(output).toBeDefined()
    expect(output.productId).toBe(id1.value)
    expect(output.stock).toBe(10)
  })

  it('should return 0 stock if product not found', async () => {
    // Arrange - Given
    const input: CheckStockUsecaseInputDto = { productId: 'invalid-id' }

    // Act - When
    const output: CheckStockUsecaseOutputDto = await usecase.execute(input)

    // Assert - Then
    expect(output).toBeDefined()
    expect(output.productId).toBe('invalid-id')
    expect(output.stock).toBe(0)
  })
})
