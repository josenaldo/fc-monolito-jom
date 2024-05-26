import { Id } from '@/modules/@shared/domain/value-object/id.value-object'
import { Product } from '@/modules/product-adm/domain/entity/product.entity'
import { ProductModel } from '@/modules/product-adm/repository/product.model'
import { ProductRepository } from '@/modules/product-adm/repository/product.repository'
import { CreateSequelize } from '@/modules/product-adm/test/test.utils'
import { Sequelize } from 'sequelize-typescript'

import { v4 as uuid } from 'uuid'

describe('Product Repository integration tests', () => {
  let sequelize: Sequelize
  let repository: ProductRepository

  beforeEach(async () => {
    sequelize = CreateSequelize()

    sequelize.addModels([ProductModel])
    await sequelize.sync()

    repository = new ProductRepository()
  })

  afterEach(async () => {
    await sequelize.close()
  })

  it('should create a product', async () => {
    // Arrange - Given
    const props = {
      name: 'product name',
      description: 'product description',
      purchasePrice: 10,
      stock: 10,
    }
    const product = new Product(props)

    // Act - When
    await repository.add(product)

    // Assert - Then
    const productModel = await ProductModel.findByPk(product.id.value)

    expect(productModel).not.toBeNull()
    expect(productModel.id).toBe(product.id.value)
    expect(productModel.name).toBe(product.name)
    expect(productModel.description).toBe(product.description)
    expect(productModel.purchasePrice).toBe(product.purchasePrice)
    expect(productModel.stock).toBe(product.stock)
    expect(productModel.createdAt).toBeDefined()
    expect(productModel.updatedAt).toBeDefined()
  })

  it('should throw an error when trying to create a product with an existing id', async () => {
    // Arrange - Given
    const id = uuid()

    const props = {
      id: id,
      name: 'Product 1',
      description: 'Description 1',
      purchasePrice: 10,
      stock: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await ProductModel.create(props)

    const product = new Product({
      ...props,
      id: new Id(props.id),
    })
    // Act - When
    const output = repository.add(product)

    // Assert - Then
    await expect(output).rejects.toThrow('Product already exists')
  })

  it('should find a product', async () => {
    // Arrange - Given
    const id1 = uuid()
    const id2 = uuid()

    await ProductModel.create({
      id: id1,
      name: 'Product 1',
      description: 'Product 1 description',
      purchasePrice: 10,
      stock: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await ProductModel.create({
      id: id2,
      name: 'Product 2',
      description: 'Product 2 description',
      purchasePrice: 20,
      stock: 20,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    // Act - When
    const product1 = await repository.find(id1)
    const product2 = await repository.find(id2)

    // Assert - Then
    expect(product1).not.toBeNull()
    expect(product1.id.value).toBe(id1)
    expect(product1.name).toBe('Product 1')
    expect(product1.description).toBe('Product 1 description')
    expect(product1.purchasePrice).toBe(10)
    expect(product1.stock).toBe(10)
    expect(product1.createdAt).toBeDefined()
    expect(product1.updatedAt).toBeDefined()

    expect(product2).not.toBeNull()
    expect(product2.id.value).toBe(id2)
    expect(product2.name).toBe('Product 2')
    expect(product2.description).toBe('Product 2 description')
    expect(product2.purchasePrice).toBe(20)
    expect(product2.stock).toBe(20)
    expect(product2.createdAt).toBeDefined()
    expect(product2.updatedAt).toBeDefined()
  })

  it('should throw a Not Found error when trying to find a product that does not exist', async () => {
    // Arrange - Given
    const id = uuid()

    // Act - When
    const f = async () => {
      await repository.find(id)
    }

    // Assert - Then
    await expect(f()).rejects.toThrow('Product not found')
  })
})
