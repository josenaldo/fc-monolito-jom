import { CreateSequelize } from '@/modules/@shared/test/test.utils'
import Product from '@/modules/product-adm/domain/entity/product.entity'
import { ProductModel } from '@/modules/product-adm/repository/product.model'
import ProductRepository from '@/modules/product-adm/repository/product.repository'
import { Sequelize } from 'sequelize-typescript'

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
})
