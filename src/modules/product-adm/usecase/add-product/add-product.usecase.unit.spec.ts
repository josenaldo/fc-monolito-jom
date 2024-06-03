import { Id } from '@/modules/@shared/domain/value-object/id.value-object'
import { ProductGateway } from '@/modules/product-adm/gateway/product.gateway'
import { CreateMockRepository } from '@/modules/product-adm/test/product-adm.test.utils'
import {
  AddProductUsecaseInputDto,
  AddProductUsecaseOutputDto,
} from '@/modules/product-adm/usecase/add-product/add-product.dto'
import { AddProductUsecase } from '@/modules/product-adm/usecase/add-product/add-product.usecase'

describe('Add Product use case unit tests', () => {
  let repository: ProductGateway
  let usecase: AddProductUsecase
  let input: AddProductUsecaseInputDto

  beforeEach(async () => {
    repository = CreateMockRepository()
    usecase = new AddProductUsecase(repository)

    input = {
      name: 'Product 1',
      description: 'Description 1',
      purchasePrice: 10,
      stock: 10,
    }
  })

  it('should add a product without an id', async () => {
    // Arrange

    // Act
    const output: AddProductUsecaseOutputDto = await usecase.execute(input)

    // Assert
    expect(repository.add).toHaveBeenCalledTimes(1)
    expect(repository.add).toHaveBeenCalledWith(
      expect.objectContaining({
        _id: expect.any(Id),
        _createdAt: expect.any(Date),
        _updatedAt: expect.any(Date),
        _name: input.name,
        _description: input.description,
        _purchasePrice: input.purchasePrice,
        _stock: input.stock,
      })
    )

    expect(output).toBeDefined()
    expect(output).toEqual({
      id: expect.any(String),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      name: input.name,
      description: input.description,
      purchasePrice: input.purchasePrice,
      stock: input.stock,
    })
  })

  it('should add a product with an id', async () => {
    // Arrange
    input.id = '123e4567-e89b-12d3-a456-426614174000'

    // Act
    const output: AddProductUsecaseOutputDto = await usecase.execute(input)

    // Assert
    expect(repository.add).toHaveBeenCalledTimes(1)
    expect(repository.add).toHaveBeenCalledWith(
      expect.objectContaining({
        _id: expect.any(Id),
        _createdAt: expect.any(Date),
        _updatedAt: expect.any(Date),
        _name: input.name,
        _description: input.description,
        _purchasePrice: input.purchasePrice,
        _stock: input.stock,
      })
    )

    expect(output).toBeDefined()
    expect(output).toEqual({
      id: expect.any(String),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      name: input.name,
      description: input.description,
      purchasePrice: input.purchasePrice,
      stock: input.stock,
    })
  })

  it('should throw an error when trying to create a product with an invalid id', async () => {
    // Arrange - Given
    input.id = 'invalid-id'

    // Act - When
    const output = usecase.execute(input)

    // Assert - Then
    await expect(output).rejects.toThrow(
      new Error('id: Invalid id: invalid-id')
    )
  })

  it('should throw an error when trying to create a product with an empty name', async () => {
    // Arrange
    input.name = ''

    // Act
    const output = usecase.execute(input)

    // Assert
    await expect(output).rejects.toThrow(
      new Error('product-adm/product: Name is required')
    )
  })

  it('should throw an error when trying to create a product with an empty description', async () => {
    // Arrange
    input.description = ''

    // Act
    const output = usecase.execute(input)

    // Assert
    await expect(output).rejects.toThrow(
      new Error('product-adm/product: Description is required')
    )
  })

  it('should throw an error when trying to create a product with a negative purchase price', async () => {
    // Arrange
    input.purchasePrice = -1

    // Act
    const output = usecase.execute(input)

    // Assert
    await expect(output).rejects.toThrow(
      new Error(
        'product-adm/product: Purchase Price must be greater than or equal to 0'
      )
    )
  })

  it('should throw an error when trying to create a product with a negative stock', async () => {
    // Arrange
    input.stock = -1

    // Act
    const output = usecase.execute(input)

    // Assert
    await expect(output).rejects.toThrow(
      new Error('product-adm/product: Stock must be greater than 0')
    )
  })
})
