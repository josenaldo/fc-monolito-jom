import { UsecaseInterface } from '@/modules/@shared/usecase/usecase.interface'
import productAdmFacadeInterface, {
  AddProductFacadeInputDto,
  AddProductFacadeOutputDto,
  CheckStockFacadeInputDto,
  CheckStockFacadeOutputDto,
} from '@/modules/product-adm/facade/product-adm.facade.interface'

export interface ProductAdmFacadeProps {
  addUsecase: UsecaseInterface
  findUsecase: UsecaseInterface
}

export default class ProductAdmFacade implements productAdmFacadeInterface {
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
    return await this._findUsecase.execute(input.productId)
  }
}
