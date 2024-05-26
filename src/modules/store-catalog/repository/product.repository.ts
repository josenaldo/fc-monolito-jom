import { Product } from '@/modules/store-catalog/domain/product.entity'
import { ProductGateway } from '@/modules/store-catalog/gateway/product.gateway'
import { ProductModelToProductMapper } from '@/modules/store-catalog/repository/product-model-to-product.mapper'
import { ProductModel } from '@/modules/store-catalog/repository/product.model'

export class ProductRepository implements ProductGateway {
  async findAll(): Promise<Product[]> {
    const models = await ProductModel.findAll()

    return models.map((model) => {
      return ProductModelToProductMapper.toProduct(model)
    })
  }

  async find(id: string): Promise<Product> {
    const model = await ProductModel.findByPk(id)

    if (!model) {
      throw new Error('Product not found')
    }

    return ProductModelToProductMapper.toProduct(model)
  }
}
