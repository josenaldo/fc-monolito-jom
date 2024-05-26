import { Id } from '@/modules/@shared/domain/value-object/id.value-object'
import { Product } from '@/modules/store-catalog/domain/product.entity'
import { ProductModel } from '@/modules/store-catalog/repository/product.model'

export class ProductModelToProductMapper {
  static toProduct(product: ProductModel) {
    return new Product({
      id: new Id(product.id),
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      name: product.name,
      description: product.description,
      salesPrice: product.salesPrice,
    })
  }
}
