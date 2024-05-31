import { DomainToModelMapperInterface } from '@/modules/@shared/repository/domain-to-model-mapper.interface'
import { Transaction } from '@/modules/payment/domain/entity/transaction.entity'
import { PaymentGateway } from '@/modules/payment/gateway/payment.gateway'
import { TransactionModelToTransactionMapper } from '@/modules/payment/repository/transaction-model-to-transaction.mapper'
import { TransactionModel } from '@/modules/payment/repository/transaction.model'

export class TransactionRepository implements PaymentGateway {
  private _mapper: DomainToModelMapperInterface<Transaction, TransactionModel>

  constructor() {
    this._mapper = new TransactionModelToTransactionMapper()
  }

  async save(input: Transaction): Promise<Transaction> {
    const model = this._mapper.toModel(input)

    const savedModel = await model.save()

    return this._mapper.toDomain(savedModel)
  }
}
