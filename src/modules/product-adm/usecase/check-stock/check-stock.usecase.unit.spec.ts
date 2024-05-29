import { Id } from '@/modules/@shared/domain/value-object/id.value-object'
import { Product } from '@/modules/product-adm/domain/entity/product.entity'
import { CreateMockRepository } from '@/modules/product-adm/test/test.utils'
import {
  CheckStockInputDto,
  CheckStockOutputDto,
} from '@/modules/product-adm/usecase/check-stock/check-stock.dto'
import { CheckStockUsecase } from '@/modules/product-adm/usecase/check-stock/check-stock.usecase'

describe('Check Stock usecase unit tests', () => {
  let id: Id
  let product: Product
  let repository: any
  let usecase: CheckStockUsecase

  beforeEach(() => {
    id = new Id()
    product = new Product({
      id: id,
      name: 'Product 1',
      description: 'Product 1 description',
      purchasePrice: 10,
      stock: 10,
    })

    repository = CreateMockRepository()

    usecase = new CheckStockUsecase(repository)
  })

  it('should check stock', async () => {
    // Arrange - Given
    repository.find = jest.fn().mockResolvedValue(product)
    const input: CheckStockInputDto = { productId: id.value }

    // Act - When
    const output: CheckStockOutputDto = await usecase.execute(input)

    // Assert - Then
    expect(repository.find).toHaveBeenCalledTimes(1)
    expect(repository.find).toHaveBeenCalledWith(id.value)
    expect(output).toBeDefined()
    expect(output.productId).toBe(id.value)
    expect(output.stock).toBe(product.stock)
  })

  it('should throw error if product not found', async () => {
    // Arrange - Given
    repository.find = jest
      .fn()
      .mockRejectedValue(new Error('Product not found'))

    // Act - When
    const output = usecase.execute({ productId: id.value })

    // Assert - Then
    await expect(output).rejects.toThrow(new Error('Product not found'))
  })
})
