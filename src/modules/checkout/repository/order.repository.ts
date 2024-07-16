import { DomainToModelMapperInterface } from '@/modules/@shared/repository/domain-to-model-mapper.interface'
import { Order } from '@/modules/checkout/domain/entity/order.entity'
import { CheckoutGateway } from '@/modules/checkout/gateway/checkout.gateway'
import { ClientModel } from '@/modules/checkout/repository/client.model'
import OrderItemModel from '@/modules/checkout/repository/order-item.model'
import { OrderModelToOrderMapper } from '@/modules/checkout/repository/order-model-to-order.mapper'
import { OrderModel } from '@/modules/checkout/repository/order.model'
import { UniqueConstraintError } from 'sequelize'

export class OrderRepository implements CheckoutGateway {
  private _mapper: DomainToModelMapperInterface<Order, OrderModel>

  constructor() {
    this._mapper = new OrderModelToOrderMapper()
  }

  async add(order: Order): Promise<void> {
    try {
      const model: OrderModel = this._mapper.toModel(order)
      await model.save()
    } catch (error) {
      console.log('error', error)

      if (error instanceof UniqueConstraintError) {
        const hasId = Object.entries(error.fields).some(
          ([key, value]) => value === 'id'
        )

        if (hasId) {
          throw new Error('Order already exists')
        }

        throw new Error('Constraint error occurred: ' + error.message)
      }
      throw error
    }
  }

  async find(id: string): Promise<Order | null> {
    const model = await OrderModel.findOne({
      where: { id },
      include: [OrderItemModel, ClientModel],
    })

    if (!model) {
      throw new Error('Order not found')
    }

    return this._mapper.toDomain(model)
  }
}
