import { Id } from '@/modules/@shared/domain/value-object/id.value-object'
import { Product } from '@/modules/product-adm/domain/entity/product.entity'
import { ProductGateway } from '@/modules/product-adm/gateway/product.gateway'
import { ProductModel } from '@/modules/product-adm/repository/product.model'
import { UniqueConstraintError } from 'sequelize'

export class ProductRepository implements ProductGateway {
  async add(product: Product): Promise<void> {
    try {
      await ProductModel.create({
        id: product.id.value,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        name: product.name,
        description: product.description,
        purchasePrice: product.purchasePrice,
        stock: product.stock,
      })
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
    const product = await ProductModel.findByPk(id)

    if (!product) {
      throw new Error('Product not found')
    }

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
}
