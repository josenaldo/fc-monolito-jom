import { Id } from '@/modules/@shared/domain/value-object/id.value-object'
import { ProductModel } from '@/modules/product-adm/repository/product.model'
import { ProductRepository } from '@/modules/product-adm/repository/product.repository'
import { CreateSequelizeWithModels } from '@/modules/product-adm/test/test.utils'
import {
  CheckStockInputDto,
  CheckStockOutputDto,
} from '@/modules/product-adm/usecase/check-stock/check-stock.dto'
import { CheckStockUsecase } from '@/modules/product-adm/usecase/check-stock/check-stock.usecase'
import { Sequelize } from 'sequelize-typescript'

describe('Check Stock usecase unit tests', () => {
  let sequelize: Sequelize
  let repository: ProductRepository
  let usecase: CheckStockUsecase
  let id1: Id
  let id2: Id

  beforeEach(async () => {
    sequelize = await CreateSequelizeWithModels([ProductModel])

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
      stock: 10,
    })

    await ProductModel.create({
      id: id2.value,
      createdAt: new Date(),
      updatedAt: new Date(),
      name: 'Product 2',
      description: 'Description 2',
      purchasePrice: 20,
      stock: 20,
    })
  })

  afterEach(async () => {
    await sequelize.drop()
  })

  it('should check stock', async () => {
    // Arrange - Given
    const input: CheckStockInputDto = { productId: id1.value }

    // Act - When
    const output: CheckStockOutputDto = await usecase.execute(input)

    // Assert - Then
    expect(output).toBeDefined()
    expect(output.productId).toBe(id1.value)
    expect(output.stock).toBe(10)
  })

  it('should throw error if product not found', async () => {
    // Arrange - Given

    // Act - When
    const output = usecase.execute({ productId: 'invalid-id' })

    // Assert - Then
    await expect(output).rejects.toThrow(new Error('Product not found'))
  })
})
