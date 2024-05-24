import Product from '@/modules/product-adm/domain/entity/product.entity'
import ProductGateway from '@/modules/product-adm/gateway/product.gateway'
import { ProductModel } from '@/modules/product-adm/repository/product.model'

export default class ProductRepository implements ProductGateway {
  async add(product: Product): Promise<void> {
    await ProductModel.create({
      id: product.id.value,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      name: product.name,
      description: product.description,
      purchasePrice: product.purchasePrice,
      stock: product.stock,
    })
  }

  async find(id: string): Promise<Product> {
    throw new Error('Method not implemented.')
  }
}
