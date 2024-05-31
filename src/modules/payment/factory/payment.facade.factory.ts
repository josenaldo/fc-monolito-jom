import { PaymentFacade } from '@/modules/payment/facade/payment.facace'
import { PaymentFacadeInterface } from '@/modules/payment/facade/payment.facade.interface'
import { TransactionRepository } from '@/modules/payment/repository/transaction.repository'
import ProcessPaymentUsecase from '@/modules/payment/usecase/process-payment/process-payment.usecase'

export class PaymentFacadeFactory {
  static create(): PaymentFacadeInterface {
    const repository = new TransactionRepository()
    const props = {
      processPaymentUsecase: new ProcessPaymentUsecase(repository),
    }

    return new PaymentFacade(props)
  }
}
