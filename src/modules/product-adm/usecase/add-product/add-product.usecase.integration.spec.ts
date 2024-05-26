import { ProductModel } from '@/modules/product-adm/repository/product.model'
import { ProductRepository } from '@/modules/product-adm/repository/product.repository'
import { CreateSequelize } from '@/modules/product-adm/test/test.utils'
import {
  AddProductInputDto,
  AddProductOutputDto,
} from '@/modules/product-adm/usecase/add-product/add-product.dto'
import { AddProductUsecase } from '@/modules/product-adm/usecase/add-product/add-product.usecase'
import { Sequelize } from 'sequelize-typescript'

describe('Add Product use case integration tests', () => {
  let sequelize: Sequelize
  let repository: ProductRepository
  let usecase: AddProductUsecase
  let input: AddProductInputDto

  beforeEach(async () => {
    sequelize = CreateSequelize()
    sequelize.addModels([ProductModel])
    await sequelize.sync()

    repository = new ProductRepository()
    usecase = new AddProductUsecase(repository)

    input = {
      name: 'Product 1',
      description: 'Description 1',
      purchasePrice: 10,
      stock: 10,
    }
  })

  it('should add a product without an id', async () => {
    // Arrange - Given

    // Act - When
    const output: AddProductOutputDto = await usecase.execute(input)

    // Assert - Then
    const productModel = await ProductModel.findByPk(output.id)

    expect(productModel).not.toBeNull()
    expect(productModel.id).toBe(output.id)
    expect(productModel.createdAt).toBeDefined()
    expect(productModel.updatedAt).toBeDefined()
    expect(productModel.name).toBe(input.name)
    expect(productModel.description).toBe(input.description)
    expect(productModel.purchasePrice).toBe(input.purchasePrice)
    expect(productModel.stock).toBe(input.stock)
  })

  it('should add a product with an id', async () => {
    // Arrange - Given
    input.id = '123e4567-e89b-12d3-a456-426614174000'

    // Act - When
    const output: AddProductOutputDto = await usecase.execute(input)

    // Assert - Then
    const productModel = await ProductModel.findByPk(output.id)

    expect(productModel).not.toBeNull()
    expect(productModel.id).toBe(output.id)
    expect(productModel.createdAt).toBeDefined()
    expect(productModel.updatedAt).toBeDefined()
    expect(productModel.name).toBe(input.name)
    expect(productModel.description).toBe(input.description)
    expect(productModel.purchasePrice).toBe(input.purchasePrice)
    expect(productModel.stock).toBe(input.stock)
  })

  it('should throw an error when trying to create a product with an invalid id', async () => {
    // Arrange - Given
    input.id = 'invalid-id'

    // Act - When
    const output = usecase.execute(input)

    // Assert - Then
    await expect(output).rejects.toThrow('Invalid id')
  })

  it('should throw an error when trying to create a product with an empty name', async () => {
    // Arrange - Given
    input.name = ''

    // Act - When
    const output = usecase.execute(input)

    // Assert - Then
    await expect(output).rejects.toThrow('product: Name is required')
  })

  it('should throw an error when trying to create a product with an empty description', async () => {
    // Arrange - Given
    input.description = ''

    // Act - When
    const output = usecase.execute(input)

    // Assert - Then
    await expect(output).rejects.toThrow('product: Description is required')
  })

  it('should throw an error when trying to create a product with a negative purchase price', async () => {
    // Arrange - Given
    input.purchasePrice = -1

    // Act - When
    const output = usecase.execute(input)

    // Assert - Then
    await expect(output).rejects.toThrow(
      'product: Purchase price must be greater than or equal to 0'
    )
  })

  it('should throw an error when trying to create a product with a negative stock', async () => {
    // Arrange - Given
    input.stock = -1

    // Act - When
    const output = usecase.execute(input)

    // Assert - Then
    await expect(output).rejects.toThrow(
      'product: Stock must be greater than or equal to 0'
    )
  })
})
