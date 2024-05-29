import { UsecaseInterface } from '@/modules/@shared/usecase/usecase.interface'
import { StoreCatalogFacade } from '@/modules/store-catalog/facade/store-catalog.facade'
import { StoreCatalogFacadeInterface } from '@/modules/store-catalog/facade/store-catalog.facade.interface'
import { ProductGateway } from '@/modules/store-catalog/gateway/product.gateway'
import { ProductRepository } from '@/modules/store-catalog/repository/product.repository'
import { FindAllProductsUsecase } from '@/modules/store-catalog/usecase/find-all-products/find-all-products.usecase'
import { FindProductUsecase } from '@/modules/store-catalog/usecase/find-product/find-product.usecase'

export class StoreCatalogFacadeFactory {
  static create(): StoreCatalogFacadeInterface {
    const repository: ProductGateway = new ProductRepository()
    const findProductUsecase: UsecaseInterface = new FindProductUsecase(
      repository
    )
    const findAllProductsUsecase: UsecaseInterface = new FindAllProductsUsecase(
      repository
    )

    return new StoreCatalogFacade({
      findUsecase: findProductUsecase,
      findAllUsecase: findAllProductsUsecase,
    })
  }
}
