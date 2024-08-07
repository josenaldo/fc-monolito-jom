import { Id } from '@/modules/@shared/domain/value-object/id.value-object'
import { Migrator } from '@/modules/@shared/test/migrator'
import { ProductModel } from '@/modules/store-catalog/repository/product.model'
import { ProductRepository } from '@/modules/store-catalog/repository/product.repository'
import { CreateMigrator } from '@/modules/store-catalog/test/store-catalog.test.utils'

describe('Product Repository integration tests', () => {
  let migrator: Migrator
  let repository: ProductRepository

  beforeEach(async () => {
    migrator = CreateMigrator()
    await migrator.up()

    repository = new ProductRepository()
  })

  afterEach(async () => {
    await migrator.down()
  })

  it('should find all products', async () => {
    // Arrange - Given
    const id1 = new Id()
    const id2 = new Id()

    await ProductModel.create({
      id: id1.value,
      createdAt: new Date(),
      updatedAt: new Date(),
      name: 'Product 1',
      description: 'Product 1 description',
      salesPrice: 10,
    })

    await ProductModel.create({
      id: id2.value,
      createdAt: new Date(),
      updatedAt: new Date(),
      name: 'Product 2',
      description: 'Product 2 description',
      salesPrice: 20,
    })

    // Act - When
    const result = await repository.findAll()

    const product1 = result.find((product) => product.id.value === id1.value)
    const product2 = result.find((product) => product.id.value === id2.value)

    // Assert - Then
    expect(product1).not.toBeNull()
    expect(product1.id).toStrictEqual(id1)
    expect(product1.createdAt).toBeDefined()
    expect(product1.updatedAt).toBeDefined()
    expect(product1.name).toBe('Product 1')
    expect(product1.description).toBe('Product 1 description')
    expect(product1.salesPrice).toBe(10)

    expect(product2).not.toBeNull()
    expect(product2.id).toStrictEqual(id2)
    expect(product2.createdAt).toBeDefined()
    expect(product2.updatedAt).toBeDefined()
    expect(product2.name).toBe('Product 2')
    expect(product2.description).toBe('Product 2 description')
    expect(product2.salesPrice).toBe(20)
  })

  it('should return an empty list when there are no products', async () => {
    // Act - When
    const result = await repository.findAll()

    // Assert - Then
    expect(result).toHaveLength(0)
  })

  it('should find a product', async () => {
    // Arrange - Given
    const id1 = new Id()

    await ProductModel.create({
      id: id1.value,
      createdAt: new Date(),
      updatedAt: new Date(),
      name: 'Product 1',
      description: 'Product 1 description',
      salesPrice: 10,
    })

    // Act - When
    const product1 = await repository.find(id1.value)

    // Assert - Then
    expect(product1).not.toBeNull()
    expect(product1.id).toStrictEqual(id1)
    expect(product1.createdAt).toBeDefined()
    expect(product1.updatedAt).toBeDefined()
    expect(product1.name).toBe('Product 1')
    expect(product1.description).toBe('Product 1 description')
    expect(product1.salesPrice).toBe(10)
  })

  it('should throw a Not Found error when trying to find a product that does not exist', async () => {
    // Arrange - Given
    const id = new Id()

    // Act - When
    const result = repository.find(id.value)

    // Assert - Then
    await expect(result).rejects.toThrow(new Error('Product not found'))
  })
})
