import { Id } from '@/modules/@shared/domain/value-object/id.value-object'
import { Migrator } from '@/modules/@shared/test/migrator'
import { StoreCatalogFacadeInterface } from '@/modules/store-catalog/facade/store-catalog.facade.interface'
import { StoreCatalogFacadeFactory } from '@/modules/store-catalog/factory/store-catalog.facade.factory'
import { ProductModel } from '@/modules/store-catalog/repository/product.model'
import { CreateMigrator } from '@/modules/store-catalog/test/store-catalog.test.utils'

describe('Store Catalog facade integration tests', () => {
  let migrator: Migrator
  let facade: StoreCatalogFacadeInterface
  let id1: Id
  let id2: Id
  let productModel1: any
  let productModel2: any

  beforeEach(async () => {
    migrator = CreateMigrator()
    await migrator.up()

    facade = StoreCatalogFacadeFactory.create()

    id1 = new Id()
    id2 = new Id()

    productModel1 = {
      id: id1.value,
      createdAt: new Date(),
      updatedAt: new Date(),
      name: 'Product 1',
      description: 'Description 1',
      salesPrice: 10.0,
    }

    productModel2 = {
      id: id2.value,
      createdAt: new Date(),
      updatedAt: new Date(),
      name: 'Product 2',
      description: 'Description 2',
      salesPrice: 20.0,
    }
  })

  afterEach(async () => {
    await migrator.down()
  })

  it('should find a product', async () => {
    // Arrange - Given
    await ProductModel.create(productModel2)
    await ProductModel.create(productModel1)
    const input = { id: id1.value }

    // Act - When
    const output = await facade.find(input)

    // Assert - Then
    expect(output).toEqual({
      id: id1.value,
      name: 'Product 1',
      description: 'Description 1',
      salesPrice: 10.0,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    })
  })

  it('should throw an error when product is not found', async () => {
    // Arrange - Given
    await ProductModel.create(productModel1)
    await ProductModel.create(productModel2)
    const input = { id: 'invalid-id' }

    // Act - When
    const output = facade.find(input)

    // Assert - Then
    await expect(output).rejects.toThrow(new Error('Product not found'))
  })

  it('should find all products', async () => {
    // Arrange - Given
    await ProductModel.create(productModel1)
    await ProductModel.create(productModel2)

    // Act - When
    const output = await facade.findAll()

    // Assert - Then
    expect(output).toEqual({
      totalCount: 2,
      products: [
        {
          id: id1.value,
          name: 'Product 1',
          description: 'Description 1',
          salesPrice: 10.0,
        },
        {
          id: id2.value,
          name: 'Product 2',
          description: 'Description 2',
          salesPrice: 20.0,
        },
      ],
    })
  })

  it('should return an empty array when there are no products', async () => {
    // Arrange - Given

    // Act - When
    const output = await facade.findAll()

    // Assert - Then
    expect(output).toEqual({
      totalCount: 0,
      products: [],
    })
  })
})
