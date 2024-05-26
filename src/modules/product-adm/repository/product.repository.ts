import { Product } from '@/modules/product-adm/domain/entity/product.entity'
import { ProductGateway } from '@/modules/product-adm/gateway/product.gateway'
import { ProductModelToProductMapper } from '@/modules/product-adm/repository/product-model-to-product.mapper'
import { ProductModel } from '@/modules/product-adm/repository/product.model'
import { UniqueConstraintError } from 'sequelize'

export class ProductRepository implements ProductGateway {
  async add(product: Product): Promise<void> {
    try {
      const model = ProductModelToProductMapper.toModel(product)
      await ProductModel.create(model)
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        const hasId = Object.entries(error.fields).some(
          ([key, value]) => value === 'id'
        )

        if (hasId) {
          throw new Error('Product already exists')
        }

        throw new Error('Constraint error occurred: ' + error.message)
      }

      throw error
    }
  }

  async find(id: string): Promise<Product> {
    const model = await ProductModel.findByPk(id)

    if (!model) {
      throw new Error('Product not found')
    }

    return ProductModelToProductMapper.toProduct(model)
  }
}
