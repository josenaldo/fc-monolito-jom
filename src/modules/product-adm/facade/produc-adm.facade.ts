import { UsecaseInterface } from '@/modules/@shared/usecase/usecase.interface'
import {
  AddProductFacadeInputDto,
  AddProductFacadeOutputDto,
  CheckStockFacadeInputDto,
  CheckStockFacadeOutputDto,
  ProductAdmFacadeInterface,
} from '@/modules/product-adm/facade/product-adm.facade.interface'

export interface ProductAdmFacadeProps {
  addUsecase: UsecaseInterface
  findUsecase: UsecaseInterface
}

export class ProductAdmFacade implements ProductAdmFacadeInterface {
  private _addUsecase: UsecaseInterface
  private _findUsecase: UsecaseInterface

  constructor(usecaseProps: ProductAdmFacadeProps) {
    this._addUsecase = usecaseProps.addUsecase
    this._findUsecase = usecaseProps.findUsecase
  }

  async addProduct(
    input: AddProductFacadeInputDto
  ): Promise<AddProductFacadeOutputDto> {
    return await this._addUsecase.execute(input)
  }

  async checkStock(
    input: CheckStockFacadeInputDto
  ): Promise<CheckStockFacadeOutputDto> {
    const product = await this._findUsecase.execute(input.productId)

    return {
      productId: product.id,
      stock: product.stock,
    }
  }
}
