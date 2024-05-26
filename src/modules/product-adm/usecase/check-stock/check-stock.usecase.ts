import { UsecaseInterface } from '@/modules/@shared/usecase/usecase.interface'
import { ProductGateway } from '@/modules/product-adm/gateway/product.gateway'
import {
  CheckStockInputDto,
  CheckStockOutputDto,
} from '@/modules/product-adm/usecase/check-stock/check-stock.dto'

export class CheckStockUsecase implements UsecaseInterface {
  private _repository: ProductGateway

  constructor(repository: ProductGateway) {
    this._repository = repository
  }

  async execute(input: CheckStockInputDto): Promise<CheckStockOutputDto> {
    const product = await this._repository.find(input.productId)

    return {
      productId: product.id.value,
      stock: product.stock,
    }
  }
}
