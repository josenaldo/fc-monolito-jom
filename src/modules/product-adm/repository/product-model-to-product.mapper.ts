import { Id } from '@/modules/@shared/domain/value-object/id.value-object'
import { DomainToModelMapperInterface } from '@/modules/@shared/repository/domain-to-model-mapper.interface'
import { Product } from '@/modules/product-adm/domain/entity/product.entity'
import { ProductModel } from '@/modules/product-adm/repository/product.model'

export class ProductModelToProductMapper
  implements DomainToModelMapperInterface<Product, ProductModel>
{
  toDomain(product: ProductModel): Product {
    return new Product({
      id: new Id(product.id),
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      name: product.name,
      description: product.description,
      purchasePrice: product.purchasePrice,
      salesPrice: product.salesPrice,
      stock: product.stock,
    })
  }

  toModel(product: Product): ProductModel {
    return new ProductModel({
      id: product.id.value,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      name: product.name,
      description: product.description,
      purchasePrice: product.purchasePrice,
      salesPrice: product.salesPrice,
      stock: product.stock,
    })
  }
}
