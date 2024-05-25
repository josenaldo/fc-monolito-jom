import Id from '@/modules/@shared/domain/value-object/id.value-object'
import { CreateSequelizeWithModels } from '@/modules/@shared/test/test.utils'
import ProductAdmFacade, {
  ProductAdmFacadeProps,
} from '@/modules/product-adm/facade/produc-adm.facade'
import { AddProductFacadeInputDto } from '@/modules/product-adm/facade/product-adm.facade.interface'
import { ProductModel } from '@/modules/product-adm/repository/product.model'
import ProductRepository from '@/modules/product-adm/repository/product.repository'
import AddProductUsecase from '@/modules/product-adm/usecase/add-product/add-product.usecase'
import FindProductUsecase from '@/modules/product-adm/usecase/find-product/find-product.usecase'
import { Sequelize } from 'sequelize-typescript'

describe('Product Adm facade integration tests', () => {
  let sequelize: Sequelize
  let productAdmFacade: ProductAdmFacade
  let repository: ProductRepository
  let input: AddProductFacadeInputDto

  beforeEach(async () => {
    sequelize = await CreateSequelizeWithModels([ProductModel])
    repository = new ProductRepository()

    const usecases: ProductAdmFacadeProps = {
      addUsecase: new AddProductUsecase(repository),
      findUsecase: new FindProductUsecase(repository),
    }

    productAdmFacade = new ProductAdmFacade(usecases)

    input = {
      name: 'product',
      description: 'description',
      purchasePrice: 10,
      stock: 10,
    }
  })

  afterAll(async () => {
    await sequelize.close()
  })

  it('should add a product with an id', async () => {
    // Arrange - Given
    const id = new Id()
    input.id = id.value

    // Act - When
    await productAdmFacade.addProduct(input)

    // Assert - Then
    const product = await repository.find(id.value)
    expect(product).toBeDefined()
    expect(product.id.value).toBe(id.value)
    expect(product.name).toBe('product')
    expect(product.description).toBe('description')
    expect(product.purchasePrice).toBe(10)
    expect(product.stock).toBe(10)
    expect(product.createdAt).toBeDefined()
    expect(product.updatedAt).toBeDefined()
  })

  it('should add a product without an id', async () => {
    // Arrange - Given
    // Act - When
    const output = await productAdmFacade.addProduct(input)

    // Assert - Then
    const product = await repository.find(output.id)
    expect(product).toBeDefined()
    expect(product.id.value).toBe(output.id)
    expect(product.name).toBe('product')
    expect(product.description).toBe('description')
    expect(product.purchasePrice).toBe(10)
    expect(product.stock).toBe(10)
    expect(product.createdAt).toBeDefined()
    expect(product.updatedAt).toBeDefined()
  })

  it('should throw an error when product already exists', async () => {
    // Arrange - Given
    const id = new Id()
    input.id = id.value

    // Act - When
    await productAdmFacade.addProduct(input)

    const output = productAdmFacade.addProduct({
      id: id.value,
      name: 'product 2',
      description: 'description 2',
      purchasePrice: 20,
      stock: 20,
    })
    // Assert - Then
    await expect(output).rejects.toThrow('Product already exists')
  })

  it('should throw an error when product is invalid', async () => {
    // Arrange - Given
    input.name = ''
    input.description = ''
    input.purchasePrice = -10
    input.stock = -10

    // Act - When
    const output = productAdmFacade.addProduct(input)

    // Assert - Then
    await expect(output).rejects.toThrow(
      'product: Name is required, Description is required, Purchase price must be greater than or equal to 0, Stock must be greater than or equal to 0'
    )
  })

  it('should find a product', async () => {})

  it('should throw an error when product not found', async () => {})
})
