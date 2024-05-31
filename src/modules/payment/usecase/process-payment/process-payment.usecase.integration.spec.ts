import { Id } from '@/modules/@shared/domain/value-object/id.value-object'
import { TransactionStatus } from '@/modules/payment/domain/entity/transaction.entity'
import { PaymentGateway } from '@/modules/payment/gateway/payment.gateway'
import { TransactionModel } from '@/modules/payment/repository/transaction.model'
import { TransactionRepository } from '@/modules/payment/repository/transaction.repository'
import { InitSequelizeForPaymentModule } from '@/modules/payment/test/payment.test.utils'
import ProcessPaymentUsecase from '@/modules/payment/usecase/process-payment/process-payment.usecase'
import {
  ProcessPaymentInputDto,
  ProcessPaymentOutputDto,
} from '@/modules/payment/usecase/process-payment/process-payment.usecase.dto'
import { Sequelize } from 'sequelize-typescript'

describe('Process Payment unit tests', () => {
  let sequelize: Sequelize
  let repository: PaymentGateway
  let usecase: ProcessPaymentUsecase

  beforeEach(async () => {
    sequelize = await InitSequelizeForPaymentModule()
    repository = new TransactionRepository()
    usecase = new ProcessPaymentUsecase(repository)
  })

  afterEach(async () => {
    await sequelize.close()
  })

  it('should process a payment and approve', async () => {
    // Arrange - Given
    const orderId = new Id()

    const input: ProcessPaymentInputDto = {
      orderId: orderId.value,
      amount: 100,
    }

    // Act - When
    const output: ProcessPaymentOutputDto = await usecase.execute(input)

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

    const input: ProcessPaymentInputDto = {
      orderId: orderId.value,
      amount: 99,
    }

    // Act - When
    const output: ProcessPaymentOutputDto = await usecase.execute(input)

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
    const input: ProcessPaymentInputDto = {
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