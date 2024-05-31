import { Id } from '@/modules/@shared/domain/value-object/id.value-object'
import {
  Transaction,
  TransactionStatus,
} from '@/modules/payment/domain/entity/transaction.entity'

describe('Transaction entity unit tests', () => {
  it('should create a transaction entity with minimum required properties', () => {
    // Arrange - Given
    const props = {
      amount: 100,
      orderId: new Id(),
    }

    // Act - When
    const transaction = new Transaction(props)

    // Assert - Then
    expect(transaction).toBeInstanceOf(Transaction)
    expect(transaction.id).toBeInstanceOf(Id)
    expect(transaction.createdAt).not.toBeNull()
    expect(transaction.updatedAt).not.toBeNull()
    expect(transaction.amount).toBe(props.amount)
    expect(transaction.orderId).toBeInstanceOf(Id)
    expect(transaction.orderId).toBe(props.orderId)
    expect(transaction.status).toBe('pending')
  })

  it('should create a transaction entity with all properties', () => {
    // Arrange - Given
    const props = {
      id: new Id(),
      createdAt: new Date(),
      updatedAt: new Date(),
      amount: 100,
      orderId: new Id(),
      status: TransactionStatus.APPROVED,
    }

    // Act - When
    const transaction = new Transaction(props)

    // Assert - Then
    expect(transaction).toBeInstanceOf(Transaction)
    expect(transaction.id).toBe(props.id)
    expect(transaction.createdAt).toBe(props.createdAt)
    expect(transaction.updatedAt).toBe(props.updatedAt)
    expect(transaction.amount).toBe(props.amount)
    expect(transaction.orderId).toBe(props.orderId)
    expect(transaction.status).toBe(props.status)
  })

  it('should throw an error if amount is less than or equal to 0', () => {
    // Arrange - Given
    const props = {
      amount: 0,
      orderId: new Id(),
    }

    // Act - When
    const createTransaction = () => new Transaction(props)

    // Assert - Then
    expect(createTransaction).toThrow(
      'payment/transaction: Amount must be greater than 0'
    )
  })

  it('should proccess and approve a transaction', () => {
    // Arrange - Given
    const props = {
      amount: 100,
      orderId: new Id(),
    }
    const transaction = new Transaction(props)

    // Act - When
    transaction.process()

    // Assert - Then
    expect(transaction.status).toBe(TransactionStatus.APPROVED)
  })

  it('should process and decline a transaction', () => {
    // Arrange - Given
    const props = {
      amount: 99,
      orderId: new Id(),
    }
    const transaction = new Transaction(props)

    // Act - When
    transaction.process()

    // Assert - Then
    expect(transaction.status).toBe(TransactionStatus.DECLINED)
  })

  it('should process a transaction and throw an error if the the transaction is already declined', () => {
    // Arrange - Given
    const props = {
      amount: 100,
      orderId: new Id(),
      status: TransactionStatus.DECLINED,
    }
    const transaction = new Transaction(props)

    // Act - When
    const processTransaction = () => transaction.process()

    // Assert - Then
    expect(processTransaction).toThrow(
      'payment/transaction: Transaction declined'
    )
  })

  it('should process a transaction and throw an error if the the transaction is already approved', () => {
    // Arrange - Given
    const props = {
      amount: 100,
      orderId: new Id(),
      status: TransactionStatus.APPROVED,
    }
    const transaction = new Transaction(props)

    // Act - When
    const processTransaction = () => transaction.process()

    // Assert - Then
    expect(processTransaction).toThrow(
      'payment/transaction: Transaction already approved'
    )
  })
})
