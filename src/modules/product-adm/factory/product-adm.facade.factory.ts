import ProductAdmFacade, {
  ProductAdmFacadeProps,
} from '@/modules/product-adm/facade/produc-adm.facade'
import ProductRepository from '@/modules/product-adm/repository/product.repository'
import AddProductUsecase from '@/modules/product-adm/usecase/add-product/add-product.usecase'
import FindProductUsecase from '@/modules/product-adm/usecase/find-product/find-product.usecase'

export class ProductAdmFacadeFactory {
  static create() {
    const repository = new ProductRepository()

    const usecaseProps: ProductAdmFacadeProps = {
      addUsecase: new AddProductUsecase(repository),
      findUsecase: new FindProductUsecase(repository),
    }

    return new ProductAdmFacade(usecaseProps)
  }
}
