import { Id } from '@/modules/@shared/domain/value-object/id.value-object'
import { DomainToModelMapperInterface } from '@/modules/@shared/repository/domain-to-model-mapper.interface'
import {
  Transaction,
  TransactionStatus,
} from '@/modules/payment/domain/entity/transaction.entity'
import { TransactionModel } from '@/modules/payment/repository/transaction.model'

export class TransactionModelToTransactionMapper
  implements DomainToModelMapperInterface<Transaction, TransactionModel>
{
  toDomain(model: TransactionModel) {
    return new Transaction({
      id: new Id(model.id),
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
      orderId: new Id(model.orderId),
      amount: model.amount,
      status: TransactionStatus[model.status as keyof typeof TransactionStatus],
    })
  }

  toModel(domain: Transaction) {
    return new TransactionModel({
      id: domain.id.value,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
      orderId: domain.orderId,
      amount: domain.amount,
      status: domain.status,
    })
  }
}
