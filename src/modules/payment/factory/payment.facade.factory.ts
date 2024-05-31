import { PaymentFacade } from '@/modules/payment/facade/payment.facace'
import { TransactionRepository } from '@/modules/payment/repository/transaction.repository'
import ProcessPaymentUsecase from '@/modules/payment/usecase/process-payment/process-payment.usecase'

export class PaymentFacadeFactory {
  static create() {
    const repository = new TransactionRepository()
    const props = {
      processPaymentUsecase: new ProcessPaymentUsecase(repository),
    }

    return new PaymentFacade(props)
  }
}
