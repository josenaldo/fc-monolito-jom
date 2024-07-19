import {
  CheckoutFacade,
  CheckoutFacadeProps,
} from '@/modules/checkout/facade/checkout.facade'
import { CheckoutGateway } from '@/modules/checkout/gateway/checkout.gateway'
import { OrderRepository } from '@/modules/checkout/repository/order.repository'
import { FindOrderUsecase } from '@/modules/checkout/usecase/find-order/find-order.usecase'
import { PlaceOrderUsecase } from '@/modules/checkout/usecase/place-order/place-order.usecase'
import { ClientAdmFacadeFactory } from '@/modules/client-adm/factory/client-adm.facade.factory'
import { InvoiceFacadeFactory } from '@/modules/invoice/factory/invoice.facade.factory'
import { PaymentFacadeFactory } from '@/modules/payment/factory/payment.facade.factory'
import { ProductAdmFacadeFactory } from '@/modules/product-adm/factory/product-adm.facade.factory'
import { StoreCatalogFacadeFactory } from '@/modules/store-catalog/factory/store-catalog.facade.factory'

export class CheckoutFacadeFactory {
  static create() {
    const repository: CheckoutGateway = new OrderRepository()

    const placeOrderUsecase = new PlaceOrderUsecase({
      repository: repository,
      clientFacade: ClientAdmFacadeFactory.create(),
      productFacade: ProductAdmFacadeFactory.create(),
      storeCatalogFacade: StoreCatalogFacadeFactory.create(),
      paymentFacade: PaymentFacadeFactory.create(),
      invoiceFacade: InvoiceFacadeFactory.create(),
    })

    const findOrderUsecase = new FindOrderUsecase({
      repository: repository,
    })

    const props: CheckoutFacadeProps = {
      placeOrderUsecase: placeOrderUsecase,
      findOrderUsecase: findOrderUsecase,
    }

    return new CheckoutFacade(props)
  }
}
