import { Migrator } from '@/modules/@shared/test/migrator'
import { PaymentGateway } from '@/modules/payment/gateway/payment.gateway'
import { TransactionModel } from '@/modules/payment/repository/transaction.model'

export function CreateMigrator(): Migrator {
  return new Migrator({ models: [TransactionModel] })
}

export function CreateMockRepository(): PaymentGateway {
  return {
    save: jest.fn(),
  }
}
