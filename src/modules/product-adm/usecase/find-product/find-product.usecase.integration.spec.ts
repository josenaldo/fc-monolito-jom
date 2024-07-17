import { Id } from '@/modules/@shared/domain/value-object/id.value-object'
import { Migrator } from '@/modules/@shared/test/migrator'
import { ProductModel } from '@/modules/product-adm/repository/product.model'
import { ProductRepository } from '@/modules/product-adm/repository/product.repository'
import { CreateMigrator } from '@/modules/product-adm/test/product-adm.test.utils'
import { FindProductUsecase } from '@/modules/product-adm/usecase/find-product/find-product.usecase'

describe('Find Product use case integration tests', () => {
  let migrator: Migrator
  let repository: ProductRepository
  let usecase: FindProductUsecase
  let id1: string
  let id2: string

  beforeEach(async () => {
    migrator = CreateMigrator()
    await migrator.up()

    repository = new ProductRepository()
    usecase = new FindProductUsecase(repository)

    id1 = new Id().value
    id2 = new Id().value

    await ProductModel.create({
      id: id1,
      createdAt: new Date(),
      updatedAt: new Date(),
      name: 'Product 1',
      description: 'Description 1',
      purchasePrice: 10,
      salesPrice: 20,
      stock: 10,
    })

    await ProductModel.create({
      id: id2,
      createdAt: new Date(),
      updatedAt: new Date(),
      name: 'Product 2',
      description: 'Description 2',
      purchasePrice: 20,
      salesPrice: 40,
      stock: 20,
    })
  })

  afterEach(async () => {
    await migrator.down()
  })

  it('should find a product', async () => {
    // Arrange - Given
    // Act - When
    const output = await usecase.execute({ id: id1 })

    // Assert - Then
    expect(output).toEqual({
      id: expect.any(String),
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
    const id = new Id()

    // Act - When
    const output = usecase.execute({ id: id.value })

    // Assert - Then
    await expect(output).rejects.toThrow(new Error('Product not found'))
  })

  it('should throw an error when trying to find a product with an invalid id', async () => {
    // Arrange - Given
    const id = 'invalid-id'

    // Act - When
    const output = usecase.execute({ id: id })

    // Assert - Then
    await expect(output).rejects.toThrow(new Error('Product not found'))
  })

  it('should throw an error when trying to find a product with an empty id', async () => {
    // Arrange - Given
    const id = ''

    // Act - When
    const output = usecase.execute({ id: id })

    // Assert - Then
    await expect(output).rejects.toThrow(new Error('Product not found'))
  })
})
