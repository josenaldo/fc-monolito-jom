import { Id } from '@/modules/@shared/domain/value-object/id.value-object'
import { Product } from '@/modules/product-adm/domain/entity/product.entity'
import { ProductGateway } from '@/modules/product-adm/gateway/product.gateway'
import { CreateMockRepository } from '@/modules/product-adm/test/product-adm.test.utils'
import { FindProductUsecase } from '@/modules/product-adm/usecase/find-product/find-product.usecase'

describe('Find Product use case unit tests', () => {
  let repository: ProductGateway
  let usecase: FindProductUsecase

  beforeEach(async () => {
    repository = CreateMockRepository()
    usecase = new FindProductUsecase(repository)
  })

  it('should find a product', async () => {
    // Arrange - Given
    const id = new Id()
    const expectedProduct = new Product({
      id: id,
      createdAt: new Date(),
      updatedAt: new Date(),
      name: 'Product 1',
      description: 'Description 1',
      purchasePrice: 10,
      salesPrice: 20,
      stock: 10,
    })
    repository.find = jest.fn().mockResolvedValue(expectedProduct)

    // Act - When
    const output = await usecase.execute({ id: id.value })

    // Assert - Then
    expect(repository.find).toHaveBeenCalledTimes(1)
    expect(repository.find).toHaveBeenCalledWith(id.value)
    expect(output).toEqual({
      id: id.value,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      name: 'Product 1',
      description: 'Description 1',
      purchasePrice: 10,
      salesPrice: 20,
      stock: 10,
    })
  })

  it('should throw a Not Found error when trying to find a product that does not exist', async () => {
    // Arrange - Given
    const id = new Id().value
    repository.find = jest.fn().mockResolvedValue(undefined)

    // Act - When
    const output = usecase.execute({ id: id })

    // Assert - Then
    await expect(output).rejects.toThrow(new Error('Product not found'))
  })

  it('should throw an error when trying to find a product with an invalid id', async () => {
    // Arrange - Given
    const id = 'invalid-id'
    repository.find = jest.fn().mockResolvedValue(undefined)
    // Act - When
    const output = usecase.execute({ id: id })

    // Assert - Then
    await expect(output).rejects.toThrow(new Error('Product not found'))
  })

  it('should throw an error when trying to find a product with an empty id', async () => {
    // Arrange - Given
    const id = ''
    repository.find = jest.fn().mockResolvedValue(undefined)

    // Act - When
    const output = usecase.execute({ id: id })

    // Assert - Then
    await expect(output).rejects.toThrow(new Error('Product not found'))
  })
})
