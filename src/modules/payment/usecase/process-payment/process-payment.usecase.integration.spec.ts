import { Id } from '@/modules/@shared/domain/value-object/id.value-object'
import { Migrator } from '@/modules/@shared/test/migrator'
import { TransactionStatus } from '@/modules/payment/domain/entity/transaction.entity'
import { PaymentGateway } from '@/modules/payment/gateway/payment.gateway'
import { TransactionModel } from '@/modules/payment/repository/transaction.model'
import { TransactionRepository } from '@/modules/payment/repository/transaction.repository'
import { CreateMigrator } from '@/modules/payment/test/payment.test.utils'
import ProcessPaymentUsecase from '@/modules/payment/usecase/process-payment/process-payment.usecase'
import {
  ProcessPaymentUsecaseInputDto,
  ProcessPaymentUsecaseOutputDto,
} from '@/modules/payment/usecase/process-payment/process-payment.usecase.dto'

describe('Process Payment unit tests', () => {
  let migrator: Migrator
  let repository: PaymentGateway
  let usecase: ProcessPaymentUsecase

  beforeEach(async () => {
    migrator = CreateMigrator()
    await migrator.up()
    repository = new TransactionRepository()
    usecase = new ProcessPaymentUsecase(repository)
  })

  afterEach(async () => {
    await migrator.down()
  })

  it('should process a payment and approve', async () => {
    // Arrange - Given
    const orderId = new Id()

    const input: ProcessPaymentUsecaseInputDto = {
      orderId: orderId.value,
      amount: 100,
    }

    // Act - When
    const output: ProcessPaymentUsecaseOutputDto = await usecase.execute(input)

    // Assert - Then
    expect(output.transactionId).not.toBeNull()
    expect(output.createdAt).not.toBeNull()
    expect(output.updatedAt).not.toBeNull()
    expect(output.orderId).toBe(orderId.value)
    expect(output.amount).toBe(input.amount)
    expect(output.status).toBe(TransactionStatus.APPROVED)

    const model = await TransactionModel.findByPk(output.transactionId)
    expect(model).not.toBeNull()
    expect(model).toMatchObject({
      id: output.transactionId,
      createdAt: output.createdAt,
      updatedAt: output.updatedAt,
      orderId: orderId.value,
      amount: input.amount,
      status: TransactionStatus.APPROVED,
    })
  })

  it('should process a payment and decline', async () => {
    // Arrange - Given
    const orderId = new Id()

    const input: ProcessPaymentUsecaseInputDto = {
      orderId: orderId.value,
      amount: 99,
    }

    // Act - When
    const output: ProcessPaymentUsecaseOutputDto = await usecase.execute(input)

    // Assert - Then
    expect(output.transactionId).not.toBeNull()
    expect(output.createdAt).not.toBeNull()
    expect(output.updatedAt).not.toBeNull()
    expect(output.orderId).toBe(orderId.value)
    expect(output.amount).toBe(input.amount)
    expect(output.status).toBe(TransactionStatus.DECLINED)

    const model = await TransactionModel.findByPk(output.transactionId)
    expect(model).not.toBeNull()
    expect(model).toMatchObject({
      id: output.transactionId,
      createdAt: output.createdAt,
      updatedAt: output.updatedAt,
      orderId: orderId.value,
      amount: input.amount,
      status: TransactionStatus.DECLINED,
    })
  })

  it('should throw an error if amount is less than or equal to 0', async () => {
    // Arrange - Given
    const input: ProcessPaymentUsecaseInputDto = {
      orderId: new Id().value,
      amount: 0,
    }

    // Act - When
    const output = usecase.execute(input)

    // Assert - Then
    await expect(output).rejects.toThrow(
      'payment/transaction: Amount must be greater than 0'
    )
  })
})
