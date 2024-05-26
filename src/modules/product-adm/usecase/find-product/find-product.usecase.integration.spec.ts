import { CreateSequelize } from '@/modules/@shared/test/test.utils'
import { ProductModel } from '@/modules/product-adm/repository/product.model'
import { ProductRepository } from '@/modules/product-adm/repository/product.repository'
import { FindProductUsecase } from '@/modules/product-adm/usecase/find-product/find-product.usecase'
import { Sequelize } from 'sequelize-typescript'
import { v4 as uuid } from 'uuid'

describe('Find Product use case integration tests', () => {
  let sequelize: Sequelize
  let repository: ProductRepository
  let usecase: FindProductUsecase
  let id1: string
  let id2: string

  beforeEach(async () => {
    sequelize = CreateSequelize()
    sequelize.addModels([ProductModel])
    await sequelize.sync()

    repository = new ProductRepository()
    usecase = new FindProductUsecase(repository)

    id1 = uuid()
    id2 = uuid()

    await ProductModel.create({
      id: id1,
      name: 'Product 1',
      description: 'Description 1',
      purchasePrice: 10,
      stock: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await ProductModel.create({
      id: id2,
      name: 'Product 2',
      description: 'Description 2',
      purchasePrice: 20,
      stock: 20,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  })

  afterEach(async () => {
    await sequelize.drop()
  })

  it('should find a product', async () => {
    // Arrange - Given
    // Act - When
    const output = await usecase.execute(id1)

    // Assert - Then
    expect(output).toEqual({
      id: expect.any(String),
      name: 'Product 1',
      description: 'Description 1',
      purchasePrice: 10,
      stock: 10,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    })
  })

  it('should throw a Not Found error when trying to find a product that does not exist', async () => {
    // Arrange - Given
    const id = uuid()

    // Act - When
    const output = usecase.execute(id)

    // Assert - Then
    await expect(output).rejects.toThrow('Product not found')
  })

  it('should throw an error when trying to find a product with an invalid id', async () => {
    // Arrange - Given
    const id = 'invalid-id'

    // Act - When
    const output = usecase.execute(id)

    // Assert - Then
    await expect(output).rejects.toThrow('Product not found')
  })

  it('should throw an error when trying to find a product with an empty id', async () => {
    // Arrange - Given
    const id = ''

    // Act - When
    const output = usecase.execute(id)

    // Assert - Then
    await expect(output).rejects.toThrow('Product not found')
  })
})
