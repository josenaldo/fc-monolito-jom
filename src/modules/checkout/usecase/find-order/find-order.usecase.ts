import { UsecaseInterface } from '@/modules/@shared/usecase/usecase.interface'
import { Order } from '@/modules/checkout/domain/entity/order.entity'
import { CheckoutGateway } from '@/modules/checkout/gateway/checkout.gateway'
import {
  FindOrderUsecaseInputDto,
  FindOrderUsecaseOutputDto,
} from '@/modules/checkout/usecase/find-order/find-order.dto'

export type FindOrderUsecaseProps = {
  repository: CheckoutGateway
}

export class FindOrderUsecase implements UsecaseInterface {
  protected _repository: CheckoutGateway

  constructor(props: FindOrderUsecaseProps) {
    this._repository = props.repository
  }

  async execute(
    input: FindOrderUsecaseInputDto
  ): Promise<FindOrderUsecaseOutputDto> {
    const order: Order = await this._repository.find(input.id)

    if (!order) throw new Error('Order not found')

    return {
      id: order.id.value,
      clientId: order.client.id.value,
      status: order.status,
      total: order.total,
      items: order.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        total: item.total,
      })),
    }
  }
}
