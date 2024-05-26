import { UsecaseInterface } from '@/modules/@shared/usecase/usecase.interface'
import {
  AddProductFacadeInputDto,
  AddProductFacadeOutputDto,
  CheckStockFacadeInputDto,
  CheckStockFacadeOutputDto,
  FindProductFacadeInputDto,
  FindProductFacadeOutputDto,
  ProductAdmFacadeInterface,
} from '@/modules/product-adm/facade/product-adm.facade.interface'
import { CheckStockOutputDto } from '@/modules/product-adm/usecase/check-stock/check-stock.dto'
import { FindProductOutputDto } from '@/modules/product-adm/usecase/find-product/find-product.dto'

export interface ProductAdmFacadeProps {
  addProductUsecase: UsecaseInterface
  checkStockUsecase: UsecaseInterface
  findProductUsecase: UsecaseInterface
}

export class ProductAdmFacade implements ProductAdmFacadeInterface {
  private _addProductUsecase: UsecaseInterface
  private _checkStockUsecase: UsecaseInterface
  private _findProductUsecase: UsecaseInterface

  constructor(usecaseProps: ProductAdmFacadeProps) {
    this._addProductUsecase = usecaseProps.addProductUsecase
    this._checkStockUsecase = usecaseProps.checkStockUsecase
    this._findProductUsecase = usecaseProps.findProductUsecase
  }

  async addProduct(
    input: AddProductFacadeInputDto
  ): Promise<AddProductFacadeOutputDto> {
    return await this._addProductUsecase.execute(input)
  }

  async checkStock(
    input: CheckStockFacadeInputDto
  ): Promise<CheckStockFacadeOutputDto> {
    const output: CheckStockOutputDto =
      await this._checkStockUsecase.execute(input)

    return {
      productId: output.productId,
      stock: output.stock,
    }
  }

  async findProduct(
    input: FindProductFacadeInputDto
  ): Promise<FindProductFacadeOutputDto> {
    const output: FindProductOutputDto =
      await this._findProductUsecase.execute(input)

    return {
      id: output.id,
      createdAt: output.createdAt,
      updatedAt: output.updatedAt,
      name: output.name,
      description: output.description,
      purchasePrice: output.purchasePrice,
      stock: output.stock,
    }
  }
}
