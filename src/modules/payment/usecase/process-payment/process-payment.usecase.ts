import { Id } from '@/modules/@shared/domain/value-object/id.value-object'
import { Transaction } from '@/modules/payment/domain/entity/transaction.entity'
import { PaymentGateway } from '@/modules/payment/gateway/payment.gateway'
import {
  ProcessPaymentUsecaseInputDto,
  ProcessPaymentUsecaseOutputDto,
} from '@/modules/payment/usecase/process-payment/process-payment.usecase.dto'

export default class ProcessPaymentUsecase {
  private repository: PaymentGateway

  constructor(repository: PaymentGateway) {
    this.repository = repository
  }

  async execute(
    input: ProcessPaymentUsecaseInputDto
  ): Promise<ProcessPaymentUsecaseOutputDto> {
    const transaction = new Transaction({
      amount: input.amount,
      orderId: new Id(input.orderId),
    })

    transaction.process()

    const persistedTransaction: Transaction =
      await this.repository.save(transaction)

    return {
      transactionId: persistedTransaction.id.value,
      createdAt: persistedTransaction.createdAt,
      updatedAt: persistedTransaction.updatedAt,
      orderId: persistedTransaction.orderId.value,
      amount: persistedTransaction.amount,
      status: persistedTransaction.status,
    }
  }
}
