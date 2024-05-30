import {
  ProductAdmFacade,
  ProductAdmFacadeProps,
} from '@/modules/product-adm/facade/product-adm.facade'
import { ProductRepository } from '@/modules/product-adm/repository/product.repository'
import { AddProductUsecase } from '@/modules/product-adm/usecase/add-product/add-product.usecase'
import { CheckStockUsecase } from '@/modules/product-adm/usecase/check-stock/check-stock.usecase'
import { FindProductUsecase } from '@/modules/product-adm/usecase/find-product/find-product.usecase'

export class ProductAdmFacadeFactory {
  static create() {
    const repository = new ProductRepository()

    const usecaseProps: ProductAdmFacadeProps = {
      addProductUsecase: new AddProductUsecase(repository),
      checkStockUsecase: new CheckStockUsecase(repository),
      findProductUsecase: new FindProductUsecase(repository),
    }

    return new ProductAdmFacade(usecaseProps)
  }
}
