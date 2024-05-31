import { DomainToModelMapperInterface } from '@/modules/@shared/repository/domain-to-model-mapper.interface'
import { Product } from '@/modules/store-catalog/domain/product.entity'
import { ProductGateway } from '@/modules/store-catalog/gateway/product.gateway'
import { ProductModelToProductMapper } from '@/modules/store-catalog/repository/product-model-to-product.mapper'
import { ProductModel } from '@/modules/store-catalog/repository/product.model'

export class ProductRepository implements ProductGateway {
  private _mapper: DomainToModelMapperInterface<Product, ProductModel>

  constructor() {
    this._mapper = new ProductModelToProductMapper()
  }

  async findAll(): Promise<Product[]> {
    const models = await ProductModel.findAll()

    return models.map((model) => {
      return this._mapper.toDomain(model)
    })
  }

  async find(id: string): Promise<Product> {
    const model = await ProductModel.findByPk(id)

    if (!model) {
      throw new Error('Product not found')
    }

    return this._mapper.toDomain(model)
  }
}
