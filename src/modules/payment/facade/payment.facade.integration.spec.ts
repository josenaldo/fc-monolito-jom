import { Id } from '@/modules/@shared/domain/value-object/id.value-object'
import {
  PaymentFacadeInterface,
  PaymentFacadeOutputDto,
} from '@/modules/payment/facade/payment.facade.interface'
import { PaymentFacadeFactory } from '@/modules/payment/factory/payment.facade.factory'
import { InitSequelizeForPaymentModule } from '@/modules/payment/test/payment.test.utils'
import { Sequelize } from 'sequelize-typescript'

describe('Payment facade integration tests', () => {
  let sequelize: Sequelize
  let facade: PaymentFacadeInterface

  beforeEach(async () => {
    sequelize = await InitSequelizeForPaymentModule()

    facade = PaymentFacadeFactory.create()
  })

  afterEach(async () => {
    await sequelize.close()
  })

  it('should process a payment and approve', async () => {
    // Arrange - Given
    const orderId = new Id()
    const input = {
      amount: 100,
      orderId: orderId.value,
    }

    // Act - When
    const output: PaymentFacadeOutputDto = await facade.process(input)

    // Assert - Then
    expect(output).toBeDefined()
    expect(output.transactionId).toBeDefined()
    expect(output.createdAt).toBeDefined()
    expect(output.updatedAt).toBeDefined()
    expect(output.orderId).toBe(orderId.value)
    expect(output.amount).toBe(input.amount)
    expect(output.status).toBe('approved')
  })

  it('should process a payment and decline', async () => {
    // Arrange - Given
    const orderId = new Id()
    const input = {
      amount: 99,
      orderId: orderId.value,
    }

    // Act - When
    const output: PaymentFacadeOutputDto = await facade.process(input)

    // Assert - Then
    expect(output).toBeDefined()
    expect(output.transactionId).toBeDefined()
    expect(output.createdAt).toBeDefined()
    expect(output.updatedAt).toBeDefined()
    expect(output.orderId).toBe(orderId.value)
    expect(output.amount).toBe(input.amount)
    expect(output.status).toBe('declined')
  })

  it('should process a payment and throw an error', async () => {
    // Arrange - Given
    const orderId = new Id()
    const input = {
      amount: -1,
      orderId: orderId.value,
    }

    // Act - When
    const output = facade.process(input)

    // Assert - Then

    await expect(output).rejects.toThrow(
      'payment/transaction: Amount must be greater than 0'
    )
  })
})
