import { AggregateRoot } from '@/modules/@shared/domain/entity/aggregate-root.interface'
import { BaseEntity } from '@/modules/@shared/domain/entity/base.entity'
import { Id } from '@/modules/@shared/domain/value-object/id.value-object'

export enum TransactionStatus {
  Approved = 'approved',
  Declined = 'declined',
  Pending = 'pending',
}

type TransactionProps = {
  id?: Id
  createdAt?: Date
  updatedAt?: Date
  amount: number
  orderId: Id
  status?: TransactionStatus
}

export class Transaction extends BaseEntity implements AggregateRoot {
  private _amount: number
  private _orderId: Id
  private _status: TransactionStatus

  constructor(props: TransactionProps) {
    super(props.id, props.createdAt, props.updatedAt)
    this._amount = props.amount
    this._orderId = props.orderId
    this._status = props.status || TransactionStatus.Pending
    this.validate()
  }

  get contextName(): string {
    return 'payment/transaction'
  }

  get amount(): number {
    return this._amount
  }

  get orderId(): Id {
    return this._orderId
  }

  get status(): string {
    return this._status
  }

  validate(): void {
    if (this._amount <= 0) {
      this.addNotificationError('Amount must be greater than 0')
    }

    this.throwIfHasNotificationErrors()
  }

  private approve(): void {
    this._status = TransactionStatus.Approved
  }

  private decline(): void {
    this._status = TransactionStatus.Declined
  }

  process(): void {
    if (this._status === TransactionStatus.Declined) {
      this.addNotificationError('Transaction declined')
    }

    if (this._status === TransactionStatus.Approved) {
      this.addNotificationError('Transaction already approved')
    }

    this.throwIfHasNotificationErrors()

    if (this._amount >= 100) {
      this.approve()
    } else {
      this.decline()
    }
  }
}
