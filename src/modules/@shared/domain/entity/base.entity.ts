import { Notification } from '@/modules/@shared/domain/notification/notification'
import { NotificationError } from '@/modules/@shared/domain/notification/notification.error'
import { Id } from '@/modules/@shared/domain/value-object/id.value-object'

export abstract class BaseEntity {
  private _id: Id
  private _createdAt: Date
  private _updatedAt: Date
  protected _notification: Notification

  constructor(id?: Id, createdAt?: Date, updatedAt?: Date) {
    this._id = id || new Id()
    this._createdAt = createdAt || new Date()
    this._updatedAt = updatedAt || new Date()
    this._notification = new Notification()
  }

  get id(): Id {
    return this._id
  }

  get createdAt(): Date {
    return this._createdAt
  }

  get updatedAt(): Date {
    return this._updatedAt
  }

  touch() {
    this._updatedAt = new Date()
  }

  get notification() {
    return this._notification
  }

  get hasNotificationErrors() {
    return this._notification.hasErrors(this.contextName)
  }

  get notificationErrors() {
    return this._notification.getErrors(this.contextName)
  }

  get notificationMessages() {
    return this._notification.messages(this.contextName)
  }

  abstract get contextName(): string

  addNotificationError(message: string) {
    this._notification.addError({
      message,
      context: this.contextName,
    })
  }

  throwIfHasNotificationErrors() {
    if (this.hasNotificationErrors) {
      throw new NotificationError(this.notificationErrors)
    }
  }
}
