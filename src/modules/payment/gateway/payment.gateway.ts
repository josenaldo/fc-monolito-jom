import { Transaction } from '@/modules/payment/domain/entity/transaction.entity'

export interface PaymentGateway {
  save(input: Transaction): Promise<Transaction>
}
