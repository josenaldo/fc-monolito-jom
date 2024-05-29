import { Id } from '@/modules/@shared/domain/value-object/id.value-object'
import { ProductGateway } from '@/modules/product-adm/gateway/product.gateway'
import { CreateMockRepository } from '@/modules/product-adm/test/test.utils'
import {
  AddProductInputDto,
  AddProductOutputDto,
} from '@/modules/product-adm/usecase/add-product/add-product.dto'
import { AddProductUsecase } from '@/modules/product-adm/usecase/add-product/add-product.usecase'

describe('Add Product use case unit tests', () => {
  let gateway: ProductGateway
  let usecase: AddProductUsecase
  let input: AddProductInputDto

  beforeEach(async () => {
    gateway = CreateMockRepository()
    usecase = new AddProductUsecase(gateway)
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
    const output: AddProductOutputDto = await usecase.execute(input)

    // Assert
    expect(gateway.add).toHaveBeenCalledTimes(1)
    expect(gateway.add).toHaveBeenCalledWith(
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
    expect(output.id).toBeDefined()
    expect(output.createdAt).toBeDefined()
    expect(output.updatedAt).toBeDefined()

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
    const output: AddProductOutputDto = await usecase.execute(input)

    // Assert
    expect(gateway.add).toHaveBeenCalledTimes(1)
    expect(gateway.add).toHaveBeenCalledWith(
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
    expect(output.id).toBe(input.id)
    expect(output.createdAt).toBeDefined()
    expect(output.updatedAt).toBeDefined()

    expect(output).toEqual({
      id: input.id,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      name: input.name,
      description: input.description,
      purchasePrice: input.purchasePrice,
      stock: input.stock,
    })
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
        'product-adm/product: Purchase price must be greater than or equal to 0'
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
      new Error('product-adm/product: Stock must be greater than or equal to 0')
    )
  })
})
