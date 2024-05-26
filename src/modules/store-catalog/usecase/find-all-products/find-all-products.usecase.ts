import { UsecaseInterface } from '@/modules/@shared/usecase/usecase.interface'
import { ProductGateway } from '@/modules/store-catalog/gateway/product.gateway'
import { FindAllProductsOutputDto } from '@/modules/store-catalog/usecase/find-all-products/find-all-products.dto'

export class FindAllProductsUsecase implements UsecaseInterface {
  private productRepository: ProductGateway

  constructor(productRepository: ProductGateway) {
    this.productRepository = productRepository
  }

  async execute(): Promise<FindAllProductsOutputDto> {
    const products = await this.productRepository.findAll()

    return {
      totalCount: products.length,
      products: products.map((product) => ({
        id: product.id.value,
        name: product.name,
        description: product.description,
        salesPrice: product.salesPrice,
      })),
    }
  }
}
