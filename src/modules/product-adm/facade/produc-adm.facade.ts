import { UsecaseInterface } from '@/modules/@shared/usecase/usecase.interface'
import productAdmFacadeInterface, {
  AddProductFacadeInputDto,
  CheckStockFacadeInputDto,
  CheckStockFacadeOutputDto,
} from '@/modules/product-adm/facade/product-adm.facade.interface'

export interface UsecaseProps {
  addUsecase: UsecaseInterface
  findUsecase: UsecaseInterface
}

export default class ProductAdmFacade implements productAdmFacadeInterface {
  private _addUsecase: UsecaseInterface
  private _findUsecase: UsecaseInterface

  constructor(usecaseProps: UsecaseProps) {
    this._addUsecase = usecaseProps.addUsecase
    this._findUsecase = usecaseProps.findUsecase
  }

  addProduct(input: AddProductFacadeInputDto): Promise<void> {
    return this._addUsecase.execute(input)
  }

  checkStock(
    input: CheckStockFacadeInputDto
  ): Promise<CheckStockFacadeOutputDto> {
    return this._findUsecase.execute(input.productId)
  }
}
