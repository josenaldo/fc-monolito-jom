import { Id } from '@/modules/@shared/domain/value-object/id.value-object'
import { Migrator } from '@/modules/@shared/test/migrator'
import {
  PaymentFacadeInterface,
  PaymentFacadeOutputDto,
} from '@/modules/payment/facade/payment.facade.interface'
import { PaymentFacadeFactory } from '@/modules/payment/factory/payment.facade.factory'
import { CreateMigrator } from '@/modules/payment/test/payment.test.utils'

describe('Payment facade integration tests', () => {
  let migrator: Migrator
  let facade: PaymentFacadeInterface

  beforeEach(async () => {
    migrator = CreateMigrator()
    await migrator.up()

    facade = PaymentFacadeFactory.create()
  })

  afterEach(async () => {
    await migrator.down()
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
