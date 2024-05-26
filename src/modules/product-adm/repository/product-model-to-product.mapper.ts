import { Id } from '@/modules/@shared/domain/value-object/id.value-object'
import { Product } from '@/modules/product-adm/domain/entity/product.entity'
import { ProductModel } from '@/modules/product-adm/repository/product.model'

export class ProductModelToProductMapper {
  static toProduct(product: ProductModel) {
    return new Product({
      id: new Id(product.id),
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      name: product.name,
      description: product.description,
      purchasePrice: product.purchasePrice,
      stock: product.stock,
    })
  }

  static toModel(product: Product) {
    return {
      id: product.id.value,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      name: product.name,
      description: product.description,
      purchasePrice: product.purchasePrice,
      stock: product.stock,
    }
  }
}
