import { Id } from '@/modules/@shared/domain/value-object/id.value-object'
import { DomainToModelMapperInterface } from '@/modules/@shared/repository/domain-to-model-mapper.interface'
import { Migrator } from '@/modules/@shared/test/migrator'
import { Product } from '@/modules/store-catalog/domain/entity/product.entity'
import { ProductModelToProductMapper } from '@/modules/store-catalog/repository/product-model-to-product.mapper'
import { ProductModel } from '@/modules/store-catalog/repository/product.model'
import { CreateMigrator } from '@/modules/store-catalog/test/store-catalog.test.utils'

describe('ProductModelToProductMapper unit tests', () => {
  let migrator: Migrator
  let mapper: DomainToModelMapperInterface<Product, ProductModel>

  beforeEach(async () => {
    migrator = CreateMigrator()
    await migrator.up()

    mapper = new ProductModelToProductMapper()
  })

  afterEach(async () => {
    await migrator.down()
  })

  it('should map ProductModel to Product', () => {
    const id: Id = new Id()

    const model: ProductModel = new ProductModel({
      id: id.value,
      createdAt: new Date(),
      updatedAt: new Date(),
      name: 'product',
      description: 'description',
      salesPrice: 10,
    })

    const domain: Product = mapper.toDomain(model)

    expect(domain).toBeInstanceOf(Product)
    expect(domain.id.value).toBe(id.value)
    expect(domain.createdAt).toEqual(model.createdAt)
    expect(domain.updatedAt).toEqual(model.updatedAt)
    expect(domain.name).toBe(model.name)
    expect(domain.description).toBe(model.description)
    expect(domain.salesPrice).toBe(model.salesPrice)
  })

  it('should map Product to ProductModel', () => {
    const id: Id = new Id()

    const domain: Product = new Product({
      id: id,
      createdAt: new Date(),
      updatedAt: new Date(),
      name: 'product',
      description: 'description',
      salesPrice: 10,
    })

    const model: ProductModel = mapper.toModel(domain)

    expect(model).toBeInstanceOf(ProductModel)
    expect(model.id).toBe(domain.id.value)
    expect(model.createdAt).toEqual(domain.createdAt)
    expect(model.updatedAt).toEqual(domain.updatedAt)
    expect(model.name).toBe(domain.name)
    expect(model.description).toBe(domain.description)
    expect(model.salesPrice).toBe(domain.salesPrice)
  })
})
