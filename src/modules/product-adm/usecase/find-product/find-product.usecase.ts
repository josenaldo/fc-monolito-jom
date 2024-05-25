import { UsecaseInterface } from '@/modules/@shared/usecase/usecase.interface'
import ProductGateway from '@/modules/product-adm/gateway/product.gateway'
import { FindProductOutputDto } from '@/modules/product-adm/usecase/find-product/find-product.dto'

export default class FindProductUsecase implements UsecaseInterface {
  private _repository: ProductGateway

  constructor(repository: ProductGateway) {
    this._repository = repository
  }

  async execute(id: string): Promise<FindProductOutputDto> {
    const product = await this._repository.find(id)

    if (!product) throw new Error('Product not found')

    return {
      id: product.id.value,
      name: product.name,
      description: product.description,
      purchasePrice: product.purchasePrice,
      stock: product.stock,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }
  }
}
