import { Id } from '@/modules/@shared/domain/value-object/id.value-object'
import { Migrator } from '@/modules/@shared/test/migrator'
import { ProductModel } from '@/modules/product-adm/repository/product.model'
import { ProductRepository } from '@/modules/product-adm/repository/product.repository'
import { CreateMigrator } from '@/modules/product-adm/test/product-adm.test.utils'
import {
  AddProductUsecaseInputDto,
  AddProductUsecaseOutputDto,
} from '@/modules/product-adm/usecase/add-product/add-product.dto'
import { AddProductUsecase } from '@/modules/product-adm/usecase/add-product/add-product.usecase'

describe('Add Product use case integration tests', () => {
  let migrator: Migrator
  let repository: ProductRepository
  let usecase: AddProductUsecase
  let input: AddProductUsecaseInputDto

  beforeEach(async () => {
    migrator = CreateMigrator()
    await migrator.up()

    repository = new ProductRepository()
    usecase = new AddProductUsecase(repository)

    input = {
      name: 'Product 1',
      description: 'Description 1',
      purchasePrice: 10,
      salesPrice: 20,
      stock: 10,
    }
  })

  afterEach(async () => {
    await migrator.down()
  })

  it('should add a product without an id', async () => {
    // Arrange - Given

    // Act - When
    const output: AddProductUsecaseOutputDto = await usecase.execute(input)

    // Assert - Then
    expect(output).toBeDefined()
    expect(output).toEqual({
      id: expect.any(String),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      name: input.name,
      description: input.description,
      purchasePrice: input.purchasePrice,
      salesPrice: input.salesPrice,
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
      salesPrice: input.salesPrice,
      stock: input.stock,
    })
  })

  it('should add a product with an id', async () => {
    // Arrange - Given
    const id = new Id()
    input.id = id.value

    // Act - When
    const output: AddProductUsecaseOutputDto = await usecase.execute(input)

    // Assert - Then
    expect(output).toBeDefined()
    expect(output).toEqual({
      id: expect.any(String),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      name: input.name,
      description: input.description,
      purchasePrice: input.purchasePrice,
      salesPrice: input.salesPrice,
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
      salesPrice: input.salesPrice,
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
        'product-adm/product: Purchase Price must be greater than or equal to 0'
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
      new Error('product-adm/product: Stock must be greater than 0')
    )
  })
})
