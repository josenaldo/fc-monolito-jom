import { TestUtils } from '@/modules/@shared/test/test.utils'
import { PaymentGateway } from '@/modules/payment/gateway/payment.gateway'
import { TransactionModel } from '@/modules/payment/repository/transaction.model'
import { Sequelize } from 'sequelize-typescript'

export async function InitSequelizeForPaymentModule(): Promise<Sequelize> {
  return await TestUtils.CreateSequelizeWithModels([TransactionModel])
}

export function CreateMockRepository(): PaymentGateway {
  return {
    save: jest.fn(),
  }
}
