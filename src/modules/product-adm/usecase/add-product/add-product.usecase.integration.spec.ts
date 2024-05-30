import { Id } from '@/modules/@shared/domain/value-object/id.value-object'
import { ProductModel } from '@/modules/product-adm/repository/product.model'
import { ProductRepository } from '@/modules/product-adm/repository/product.repository'
import { CreateSequelizeWithModels } from '@/modules/product-adm/test/test.utils'
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
    sequelize = await CreateSequelizeWithModels([ProductModel])

    repository = new ProductRepository()
    usecase = new AddProductUsecase(repository)

    input = {
      name: 'Product 1',
      description: 'Description 1',
      purchasePrice: 10,
      stock: 10,
    }
  })

  afterEach(async () => {
    await sequelize.close()
  })

  it('should add a product without an id', async () => {
    // Arrange - Given

    // Act - When
    const output: AddProductOutputDto = await usecase.execute(input)

    // Assert - Then
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

    const productModel = await ProductModel.findByPk(output.id)

    expect(productModel).not.toBeNull()
    expect(productModel).toMatchObject({
      id: output.id,
      createdAt: output.createdAt,
      updatedAt: output.updatedAt,
      name: input.name,
      description: input.description,
      purchasePrice: input.purchasePrice,
      stock: input.stock,
    })
  })

  it('should add a product with an id', async () => {
    // Arrange - Given
    const id = new Id()
    input.id = id.value

    // Act - When
    const output: AddProductOutputDto = await usecase.execute(input)

    // Assert - Then
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

    const productModel = await ProductModel.findByPk(output.id)

    expect(productModel).not.toBeNull()
    expect(productModel).toMatchObject({
      id: output.id,
      createdAt: output.createdAt,
      updatedAt: output.updatedAt,
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
    await expect(output).rejects.toThrow(new Error('Invalid id'))
  })

  it('should throw an error when trying to create a product with an empty name', async () => {
    // Arrange - Given
    input.name = ''

    // Act - When
    const output = usecase.execute(input)

    // Assert - Then
    await expect(output).rejects.toThrow(
      new Error('product-adm/product: Name is required')
    )
  })

  it('should throw an error when trying to create a product with an empty description', async () => {
    // Arrange - Given
    input.description = ''

    // Act - When
    const output = usecase.execute(input)

    // Assert - Then
    await expect(output).rejects.toThrow(
      new Error('product-adm/product: Description is required')
    )
  })

  it('should throw an error when trying to create a product with a negative purchase price', async () => {
    // Arrange - Given
    input.purchasePrice = -1

    // Act - When
    const output = usecase.execute(input)

    // Assert - Then
    await expect(output).rejects.toThrow(
      new Error(
        'product-adm/product: Purchase price must be greater than or equal to 0'
      )
    )
  })

  it('should throw an error when trying to create a product with a negative stock', async () => {
    // Arrange - Given
    input.stock = -1

    // Act - When
    const output = usecase.execute(input)

    // Assert - Then
    await expect(output).rejects.toThrow(
      new Error('product-adm/product: Stock must be greater than or equal to 0')
    )
  })
})
