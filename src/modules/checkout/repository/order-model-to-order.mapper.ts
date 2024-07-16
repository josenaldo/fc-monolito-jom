import { Address } from '@/modules/@shared/domain/value-object/address'
import { Id } from '@/modules/@shared/domain/value-object/id.value-object'
import { DomainToModelMapperInterface } from '@/modules/@shared/repository/domain-to-model-mapper.interface'
import { Client } from '@/modules/checkout/domain/entity/client.entity'
import { OrderItem } from '@/modules/checkout/domain/entity/order-item.entity'
import {
  Order,
  OrderStatus,
} from '@/modules/checkout/domain/entity/order.entity'
import { ClientModel } from '@/modules/checkout/repository/client.model'
import OrderItemModel from '@/modules/checkout/repository/order-item.model'
import { OrderModel } from '@/modules/checkout/repository/order.model'

export class OrderModelToOrderMapper
  implements DomainToModelMapperInterface<Order, OrderModel>
{
  toDomain(model: OrderModel): Order {
    const items = model.items.map((item) => {
      return new OrderItem({
        id: new Id(item.id),
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })
    })

    const client: Client = new Client({
      id: new Id(model.clientId),
      createdAt: model.client.createdAt,
      updatedAt: model.client.updatedAt,
      name: model.client.name,
      email: model.client.email,
      document: model.client.document,
      address: new Address({
        street: model.client.street,
        number: model.client.number,
        complement: model.client.complement,
        city: model.client.city,
        state: model.client.state,
        zipCode: model.client.zipCode,
      }),
    })

    const domain: Order = new Order({
      id: new Id(model.id),
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
      client: client,
      items: items,
      status: model.status as OrderStatus,
    })

    return domain
  }

  toModel(domain: Order): OrderModel {
    const items = domain.items
    return new OrderModel(
      {
        id: domain.id.value,
        createdAt: domain.createdAt,
        updatedAt: domain.updatedAt,
        status: domain.status,

        clientId: domain.client.id.value,
        items: items.map((item) => {
          return {
            id: item.id.value,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            orderId: domain.id.value,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            total: item.total,
          }
        }),
        total: domain.total,
      },
      {
        include: [OrderItemModel, ClientModel],
      }
    )
  }
}
