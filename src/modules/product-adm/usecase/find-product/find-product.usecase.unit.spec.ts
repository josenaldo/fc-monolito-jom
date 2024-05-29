import { Id } from '@/modules/@shared/domain/value-object/id.value-object'
import { Product } from '@/modules/product-adm/domain/entity/product.entity'
import { ProductGateway } from '@/modules/product-adm/gateway/product.gateway'
import { CreateMockRepository } from '@/modules/product-adm/test/test.utils'
import { FindProductUsecase } from '@/modules/product-adm/usecase/find-product/find-product.usecase'
import { v4 as uuid } from 'uuid'

describe('Find Product use case unit tests', () => {
  let gateway: ProductGateway
  let usecase: FindProductUsecase

  beforeEach(async () => {
    gateway = CreateMockRepository()
    usecase = new FindProductUsecase(gateway)
  })

  it('should find a product', async () => {
    // Arrange - Given
    const id = uuid()
    const expectedProduct = new Product({
      id: new Id(id),
      createdAt: new Date(),
      updatedAt: new Date(),
      name: 'Product 1',
      description: 'Description 1',
      purchasePrice: 10,
      stock: 10,
    })
    gateway.find = jest.fn().mockResolvedValue(expectedProduct)

    // Act - When
    const output = await usecase.execute({ id: id })

    // Assert - Then
    expect(gateway.find).toHaveBeenCalledTimes(1)
    expect(gateway.find).toHaveBeenCalledWith(id)
    expect(output).toEqual({
      id,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      name: 'Product 1',
      description: 'Description 1',
      purchasePrice: 10,
      stock: 10,
    })
  })

  it('should throw a Not Found error when trying to find a product that does not exist', async () => {
    // Arrange - Given
    const id = uuid()
    gateway.find = jest.fn().mockResolvedValue(undefined)

    // Act - When
    const output = usecase.execute({ id: id })

    // Assert - Then
    await expect(output).rejects.toThrow(new Error('Product not found'))
  })

  it('should throw an error when trying to find a product with an invalid id', async () => {
    // Arrange - Given
    const id = 'invalid-id'
    gateway.find = jest.fn().mockResolvedValue(undefined)
    // Act - When
    const output = usecase.execute({ id: id })

    // Assert - Then
    await expect(output).rejects.toThrow(new Error('Product not found'))
  })

  it('should throw an error when trying to find a product with an empty id', async () => {
    // Arrange - Given
    const id = ''
    gateway.find = jest.fn().mockResolvedValue(undefined)

    // Act - When
    const output = usecase.execute({ id: id })

    // Assert - Then
    await expect(output).rejects.toThrow(new Error('Product not found'))
  })
})
