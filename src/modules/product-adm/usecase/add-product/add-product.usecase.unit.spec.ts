import Id from '@/modules/@shared/domain/value-object/id.value-object'
import { CreateMockRepository } from '@/modules/@shared/test/test.utils'
import ProductGateway from '@/modules/product-adm/gateway/product.gateway'
import {
  AddProductInputDto,
  AddProductOutputDto,
} from '@/modules/product-adm/usecase/add-product/add-product.dto'
import AddProductUseCase from '@/modules/product-adm/usecase/add-product/add-product.usecase'

describe('Add Product use case unit tests', () => {
  let gateway: ProductGateway
  let usecase: AddProductUseCase
  let input: AddProductInputDto

  beforeEach(async () => {
    gateway = CreateMockRepository()
    usecase = new AddProductUseCase(gateway)
    input = {
      name: 'Product 1',
      description: 'Description 1',
      purchasePrice: 10,
      stock: 10,
    }
  })

  it('should add a product', async () => {
    // Arrange

    // Act
    const output: AddProductOutputDto = await usecase.execute(input)

    // Assert
    expect(gateway.add).toHaveBeenCalledTimes(1)
    expect(gateway.add).toHaveBeenCalledWith(
      expect.objectContaining({
        _id: expect.any(Id),
        _name: input.name,
        _description: input.description,
        _purchasePrice: input.purchasePrice,
        _stock: input.stock,
        _createdAt: expect.any(Date),
        _updatedAt: expect.any(Date),
      })
    )
    expect(output.id).toBeDefined()
    expect(output.createdAt).toBeDefined()
    expect(output.updatedAt).toBeDefined()

    expect(output).toEqual({
      id: expect.any(String),
      name: input.name,
      description: input.description,
      purchasePrice: input.purchasePrice,
      stock: input.stock,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    })
  })

  it('should throw an error when trying to create a product with an empty name', async () => {
    // Arrange
    input.name = ''

    // Act
    const output = usecase.execute(input)

    // Assert
    await expect(output).rejects.toThrow('product: Name is required')
  })

  it('should throw an error when trying to create a product with an empty description', async () => {
    // Arrange
    input.description = ''

    // Act
    const output = usecase.execute(input)

    // Assert
    await expect(output).rejects.toThrow('product: Description is required')
  })

  it('should throw an error when trying to create a product with a negative purchase price', async () => {
    // Arrange
    input.purchasePrice = -1

    // Act
    const output = usecase.execute(input)

    // Assert
    await expect(output).rejects.toThrow(
      'product: Purchase price must be greater than or equal to 0'
    )
  })

  it('should throw an error when trying to create a product with a negative stock', async () => {
    // Arrange
    input.stock = -1

    // Act
    const output = usecase.execute(input)

    // Assert
    await expect(output).rejects.toThrow(
      'product: Stock must be greater than or equal to 0'
    )
  })
})
