import { ProductModel } from '@/modules/store-catalog/repository/product.model'
import { ProductRepository } from '@/modules/store-catalog/repository/product.repository'
import { CreateSequelizeWithModels } from '@/modules/store-catalog/test/test.utils'
import { Sequelize } from 'sequelize-typescript'

import { v4 as uuid } from 'uuid'

describe('Product Repository integration tests', () => {
  let sequelize: Sequelize
  let repository: ProductRepository

  beforeEach(async () => {
    sequelize = await CreateSequelizeWithModels([ProductModel])

    repository = new ProductRepository()
  })

  afterEach(async () => {
    await sequelize.close()
  })

  it('should find all products', async () => {
    // Arrange - Given
    const id1 = uuid()
    const id2 = uuid()

    await ProductModel.create({
      id: id1,
      createdAt: new Date(),
      updatedAt: new Date(),
      name: 'Product 1',
      description: 'Product 1 description',
      salesPrice: 10,
    })

    await ProductModel.create({
      id: id2,
      createdAt: new Date(),
      updatedAt: new Date(),
      name: 'Product 2',
      description: 'Product 2 description',
      salesPrice: 20,
    })

    // Act - When
    const result = await repository.findAll()

    const product1 = result.find((product) => product.id.value === id1)
    const product2 = result.find((product) => product.id.value === id2)

    // Assert - Then
    expect(product1).not.toBeNull()
    expect(product1.id.value).toBe(id1)
    expect(product1.createdAt).toBeDefined()
    expect(product1.updatedAt).toBeDefined()
    expect(product1.name).toBe('Product 1')
    expect(product1.description).toBe('Product 1 description')
    expect(product1.salesPrice).toBe(10)

    expect(product2).not.toBeNull()
    expect(product2.id.value).toBe(id2)
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
    const id1 = uuid()

    await ProductModel.create({
      id: id1,
      createdAt: new Date(),
      updatedAt: new Date(),
      name: 'Product 1',
      description: 'Product 1 description',
      salesPrice: 10,
    })

    // Act - When
    const product1 = await repository.find(id1)

    // Assert - Then
    expect(product1).not.toBeNull()
    expect(product1.id.value).toBe(id1)
    expect(product1.createdAt).toBeDefined()
    expect(product1.updatedAt).toBeDefined()
    expect(product1.name).toBe('Product 1')
    expect(product1.description).toBe('Product 1 description')
    expect(product1.salesPrice).toBe(10)
  })

  it('should throw a Not Found error when trying to find a product that does not exist', async () => {
    // Arrange - Given
    const id = uuid()

    // Act - When
    const result = repository.find(id)

    // Assert - Then
    await expect(result).rejects.toThrow(new Error('Product not found'))
  })
})
