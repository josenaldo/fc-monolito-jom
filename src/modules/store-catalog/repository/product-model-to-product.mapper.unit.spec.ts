import { Id } from '@/modules/@shared/domain/value-object/id.value-object'
import { DomainToModelMapperInterface } from '@/modules/@shared/repository/domain-to-model-mapper.interface'
import { Product } from '@/modules/store-catalog/domain/product.entity'
import { ProductModelToProductMapper } from '@/modules/store-catalog/repository/product-model-to-product.mapper'
import { ProductModel } from '@/modules/store-catalog/repository/product.model'
import { InitSequelizeForStoreCatalogModule } from '@/modules/store-catalog/test/store-catalog.test.utils'
import { Sequelize } from 'sequelize-typescript'

describe('ProductModelToProductMapper unit tests', () => {
  let sequelize: Sequelize
  let mapper: DomainToModelMapperInterface<Product, ProductModel>

  beforeEach(async () => {
    sequelize = await InitSequelizeForStoreCatalogModule()
    mapper = new ProductModelToProductMapper()
  })

  afterEach(async () => {
    await sequelize.close()
  })

  it('should map ProductModel to Product', () => {
    const id: Id = new Id()

    const productModel: ProductModel = new ProductModel({
      id: id.value,
      createdAt: new Date(),
      updatedAt: new Date(),
      name: 'product',
      description: 'description',
      salesPrice: 10,
    })

    const product: Product = mapper.toDomain(productModel)

    expect(product).toBeInstanceOf(Product)
    expect(product.id.value).toBe(id.value)
    expect(product.createdAt).toEqual(productModel.createdAt)
    expect(product.updatedAt).toEqual(productModel.updatedAt)
    expect(product.name).toBe(productModel.name)
    expect(product.description).toBe(productModel.description)
    expect(product.salesPrice).toBe(productModel.salesPrice)
  })

  it('should map Product to ProductModel', () => {
    const id: Id = new Id()

    const product: Product = new Product({
      id: id,
      createdAt: new Date(),
      updatedAt: new Date(),
      name: 'product',
      description: 'description',
      salesPrice: 10,
    })

    const productModel: ProductModel = mapper.toModel(product)

    expect(productModel).toBeInstanceOf(ProductModel)
    expect(productModel.id).toBe(product.id.value)
    expect(productModel.createdAt).toEqual(product.createdAt)
    expect(productModel.updatedAt).toEqual(product.updatedAt)
    expect(productModel.name).toBe(product.name)
    expect(productModel.description).toBe(product.description)
    expect(productModel.salesPrice).toBe(product.salesPrice)
  })
})
