import { Id } from '@/modules/@shared/domain/value-object/id.value-object'
import { TransactionStatus } from '@/modules/payment/domain/entity/transaction.entity'
import { PaymentGateway } from '@/modules/payment/gateway/payment.gateway'
import { CreateMockRepository } from '@/modules/payment/test/test.utils'
import ProcessPaymentUsecase from '@/modules/payment/usecase/process-payment/process-payment.usecase'
import {
  ProcessPaymentInputDto,
  ProcessPaymentOutputDto,
} from '@/modules/payment/usecase/process-payment/process-payment.usecase.dto'

describe('Process Payment unit tests', () => {
  let repository: PaymentGateway
  let usecase: ProcessPaymentUsecase

  beforeEach(async () => {
    repository = CreateMockRepository()
    usecase = new ProcessPaymentUsecase(repository)
  })

  afterEach(async () => {})

  it('should process a payment and approve', async () => {
    // Arrange - Given
    const orderId = new Id()

    const input: ProcessPaymentInputDto = {
      orderId: orderId.value,
      amount: 100,
    }

    repository.save = jest
      .fn()
      .mockImplementation((input) => Promise.resolve(input))

    // Act - When
    const output: ProcessPaymentOutputDto = await usecase.execute(input)

    // Assert - Then
    expect(repository.save).toHaveBeenCalledTimes(1)
    expect(repository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        _id: expect.any(Id),
        _createdAt: expect.any(Date),
        _updatedAt: expect.any(Date),
        _amount: input.amount,
        _orderId: orderId,
        _status: TransactionStatus.Approved,
      })
    )

    expect(output.transactionId).not.toBeNull()
    expect(output.createdAt).not.toBeNull()
    expect(output.updatedAt).not.toBeNull()
    expect(output.orderId).toBe(orderId.value)
    expect(output.amount).toBe(input.amount)
    expect(output.status).toBe(TransactionStatus.Approved)
  })

  it('should process a payment and decline', async () => {
    // Arrange - Given
    const orderId = new Id()

    const input: ProcessPaymentInputDto = {
      orderId: orderId.value,
      amount: 99,
    }

    repository.save = jest
      .fn()
      .mockImplementation((input) => Promise.resolve(input))

    // Act - When
    const output: ProcessPaymentOutputDto = await usecase.execute(input)

    // Assert - Then
    expect(repository.save).toHaveBeenCalledTimes(1)
    expect(repository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        _id: expect.any(Id),
        _createdAt: expect.any(Date),
        _updatedAt: expect.any(Date),
        _amount: input.amount,
        _orderId: orderId,
        _status: TransactionStatus.Declined,
      })
    )

    expect(output.transactionId).not.toBeNull()
    expect(output.createdAt).not.toBeNull()
    expect(output.updatedAt).not.toBeNull()
    expect(output.orderId).toBe(orderId.value)
    expect(output.amount).toBe(input.amount)
    expect(output.status).toBe(TransactionStatus.Declined)
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
