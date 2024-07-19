import {
  CheckoutFacadeInterface,
  FindOrderFacadeInputDto,
  FindOrderFacadeOutputDto,
  PlaceOrderFacadeInputDto,
  PlaceOrderFacadeOutputDto,
} from '@/modules/checkout/facade/checkout.facade.interface'
import { FindOrderUsecaseOutputDto } from '@/modules/checkout/usecase/find-order/find-order.dto'
import { FindOrderUsecase } from '@/modules/checkout/usecase/find-order/find-order.usecase'
import { PlaceOrderUsecaseOutputDto } from '@/modules/checkout/usecase/place-order/place-order.dto'
import { PlaceOrderUsecase } from '@/modules/checkout/usecase/place-order/place-order.usecase'

export interface CheckoutFacadeProps {
  placeOrderUsecase: PlaceOrderUsecase
  findOrderUsecase: FindOrderUsecase
}

export class CheckoutFacade implements CheckoutFacadeInterface {
  private placeOrderUsecase: PlaceOrderUsecase
  private findOrderUsecase: FindOrderUsecase

  constructor(props: CheckoutFacadeProps) {
    this.placeOrderUsecase = props.placeOrderUsecase
    this.findOrderUsecase = props.findOrderUsecase
  }

  async placeOrder(
    input: PlaceOrderFacadeInputDto
  ): Promise<PlaceOrderFacadeOutputDto> {
    const result: PlaceOrderUsecaseOutputDto =
      await this.placeOrderUsecase.execute(input)

    return {
      id: result.id,
      invoiceId: result.invoiceId,
      clientId: result.clientId,
      status: result.status,
      total: result.total,
      items: result.items,
    }
  }

  async findOrder(
    input: FindOrderFacadeInputDto
  ): Promise<FindOrderFacadeOutputDto> {
    const result: FindOrderUsecaseOutputDto =
      await this.findOrderUsecase.execute({
        id: input.id,
      })

    return {
      id: result.id,
      clientId: result.clientId,
      status: result.status,
      total: result.total,
      items: result.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        total: item.total,
      })),
    }
  }
}
