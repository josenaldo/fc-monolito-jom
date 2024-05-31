import { UsecaseInterface } from '@/modules/@shared/usecase/usecase.interface'
import {
  PaymentFacadeInputDto,
  PaymentFacadeInterface,
  PaymentFacadeOutputDto,
} from '@/modules/payment/facade/payment.facade.interface'

export type PaymentFacadeProps = {
  processPaymentUsecase: UsecaseInterface
}

export class PaymentFacade implements PaymentFacadeInterface {
  private _processPaymentUsecase: UsecaseInterface

  constructor(props: PaymentFacadeProps) {
    this._processPaymentUsecase = props.processPaymentUsecase
  }

  async process(input: PaymentFacadeInputDto): Promise<PaymentFacadeOutputDto> {
    const output = await this._processPaymentUsecase.execute(input)

    return {
      transactionId: output.transactionId,
      createdAt: output.createdAt,
      updatedAt: output.updatedAt,
      orderId: output.orderId,
      amount: output.amount,
      status: output.status,
    }
  }
}
