import { UsecaseInterface } from '@/modules/@shared/usecase/usecase.interface'
import { ProductGateway } from '@/modules/product-adm/gateway/product.gateway'
import {
  FindProductUsecaseInputDto,
  FindProductUsecaseOutputDto,
} from '@/modules/product-adm/usecase/find-product/find-product.dto'

export class FindProductUsecase implements UsecaseInterface {
  private _repository: ProductGateway

  constructor(repository: ProductGateway) {
    this._repository = repository
  }

  async execute(
    input: FindProductUsecaseInputDto
  ): Promise<FindProductUsecaseOutputDto> {
    const product = await this._repository.find(input.id)

    if (!product) throw new Error('Product not found')

    return {
      id: product.id.value,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      name: product.name,
      description: product.description,
      purchasePrice: product.purchasePrice,
      salesPrice: product.salesPrice,
      stock: product.stock,
    }
  }
}
