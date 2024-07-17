import { Id } from '@/modules/@shared/domain/value-object/id.value-object'
import { Product } from '@/modules/product-adm/domain/entity/product.entity'
import { CreateMockRepository } from '@/modules/product-adm/test/product-adm.test.utils'
import {
  CheckStockUsecaseInputDto,
  CheckStockUsecaseOutputDto,
} from '@/modules/product-adm/usecase/check-stock/check-stock.dto'
import { CheckStockUsecase } from '@/modules/product-adm/usecase/check-stock/check-stock.usecase'

describe('Check Stock usecase unit tests', () => {
  let id: Id
  let product: Product
  let repository: any
  let usecase: CheckStockUsecase

  beforeEach(() => {
    repository = CreateMockRepository()
    usecase = new CheckStockUsecase(repository)

    id = new Id()
    product = new Product({
      id: id,
      name: 'Product 1',
      description: 'Product 1 description',
      purchasePrice: 10,
      salesPrice: 20,
      stock: 10,
    })
  })

  it('should check stock', async () => {
    // Arrange - Given
    repository.find = jest.fn().mockResolvedValue(product)
    const input: CheckStockUsecaseInputDto = { productId: id.value }

    // Act - When
    const output: CheckStockUsecaseOutputDto = await usecase.execute(input)

    // Assert - Then
    expect(repository.find).toHaveBeenCalledTimes(1)
    expect(repository.find).toHaveBeenCalledWith(id.value)
    expect(output).toBeDefined()
    expect(output.productId).toBe(id.value)
    expect(output.stock).toBe(product.stock)
  })

  it('should return 0 stock if product not found', async () => {
    // Arrange - Given
    repository.find = jest
      .fn()
      .mockRejectedValue(new Error('Product not found'))
    const input: CheckStockUsecaseInputDto = { productId: id.value }

    // Act - When
    const output: CheckStockUsecaseOutputDto = await usecase.execute(input)

    // Assert - Then
    expect(repository.find).toHaveBeenCalledTimes(1)
    expect(repository.find).toHaveBeenCalledWith(id.value)
    expect(output).toBeDefined()
    expect(output.productId).toBe(id.value)
    expect(output.stock).toBe(0)
  })
})
