import { Id } from '@/modules/@shared/domain/value-object/id.value-object'
import { DomainToModelMapperInterface } from '@/modules/@shared/repository/domain-to-model-mapper.interface'
import { Product } from '@/modules/product-adm/domain/entity/product.entity'
import { ProductModelToProductMapper } from '@/modules/product-adm/repository/product-model-to-product.mapper'
import { ProductModel } from '@/modules/product-adm/repository/product.model'
import { InitSequelizeForProductAdmModule } from '@/modules/product-adm/test/product-adm.test.utils'
import { Sequelize } from 'sequelize-typescript'

describe('ProductModelToProductMapper unit tests', () => {
  let sequelize: Sequelize
  let mapper: DomainToModelMapperInterface<Product, ProductModel>

  beforeEach(async () => {
    sequelize = await InitSequelizeForProductAdmModule()
    mapper = new ProductModelToProductMapper()
  })

  afterEach(async () => {
    await sequelize.close()
  })

  it('should map ProductModel to Product', () => {
    const id: Id = new Id()

    const model: ProductModel = new ProductModel({
      id: id.value,
      createdAt: new Date(),
      updatedAt: new Date(),
      name: 'product',
      description: 'description',
      purchasePrice: 10,
      stock: 10,
    })

    const domain = mapper.toDomain(model)

    expect(domain).toBeInstanceOf(Product)
    expect(domain.id.value).toBe(id.value)
    expect(domain.createdAt).toEqual(model.createdAt)
    expect(domain.updatedAt).toEqual(model.updatedAt)
    expect(domain.name).toBe(model.name)
    expect(domain.description).toBe(model.description)
    expect(domain.purchasePrice).toBe(model.purchasePrice)
    expect(domain.stock).toBe(model.stock)
  })

  it('should map Product to ProductModel', () => {
    const id: Id = new Id()

    const domain: Product = new Product({
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      name: 'product',
      description: 'description',
      purchasePrice: 10,
      stock: 10,
    })

    const model = mapper.toModel(domain)

    expect(model.id).toBe(domain.id.value)
    expect(model.createdAt).toEqual(domain.createdAt)
    expect(model.updatedAt).toEqual(domain.updatedAt)
    expect(model.name).toBe(domain.name)
    expect(model.description).toBe(domain.description)
    expect(model.purchasePrice).toBe(domain.purchasePrice)
    expect(model.stock).toBe(domain.stock)
  })
})
