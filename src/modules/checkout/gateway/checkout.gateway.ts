import { Order } from '@/modules/checkout/domain/entity/order.entity'

export interface CheckoutGateway {
  add(order: Order): Promise<void>
  find(id: string): Promise<Order | null>
}
