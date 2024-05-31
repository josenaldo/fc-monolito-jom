import { Id } from '@/modules/@shared/domain/value-object/id.value-object'
import {
  Transaction,
  TransactionStatus,
} from '@/modules/payment/domain/entity/transaction.entity'
import { TransactionModel } from '@/modules/payment/repository/transaction.model'
import { TransactionRepository } from '@/modules/payment/repository/transaction.repository'
import { InitSequelizeForPaymentModule } from '@/modules/payment/test/payment.test.utils'
import { Sequelize } from 'sequelize-typescript'

describe('Transaction Repository integration tests', () => {
  let sequelize: Sequelize
  let repository: TransactionRepository

  beforeEach(async () => {
    sequelize = await InitSequelizeForPaymentModule()

    repository = new TransactionRepository()
  })

  afterEach(async () => {
    await sequelize.close()
  })

  it('should save a transaction', async () => {
    // Arrange - Given
    const transaction = new Transaction({
      id: new Id(),
      createdAt: new Date(),
      updatedAt: new Date(),
      amount: 10,
      orderId: new Id(),
      status: TransactionStatus.PENDING,
    })

    // Act - When
    const output: Transaction = await repository.save(transaction)

    // Assert - Then
    expect(output).not.toBeNull()
    expect(output.id).toStrictEqual(transaction.id)
    expect(output.createdAt).toBeDefined()
    expect(output.updatedAt).toBeDefined()
    expect(output.orderId).toStrictEqual(transaction.orderId)
    expect(output.amount).toBe(transaction.amount)
    expect(output.status).toBe(transaction.status)

    const model = await TransactionModel.findByPk(transaction.id.value)

    expect(model).not.toBeNull()
    expect(model.id).toBe(transaction.id.value)
    expect(model.createdAt).toEqual(transaction.createdAt)
    expect(model.updatedAt).toEqual(transaction.updatedAt)
    expect(model.amount).toBe(transaction.amount)
    expect(model.status).toBe(transaction.status)
  })
})
