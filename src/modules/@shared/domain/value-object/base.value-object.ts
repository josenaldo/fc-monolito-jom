import { Notification } from '@/modules/@shared/domain/notification/notification'
import { NotificationError } from '@/modules/@shared/domain/notification/notification.error'
import { ValueObject } from '@/modules/@shared/domain/value-object/value-object.interface'

export abstract class BaseValueObject implements ValueObject {
  protected _notification: Notification
  protected _parentContext?: string

  constructor(parentContext?: string) {
    this._notification = new Notification()
    this._parentContext = parentContext
  }

  abstract get contextName(): string

  abstract validate(): void

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

  addNotificationError(message: string) {
    this._notification.addError({
      message,
      context: this._parentContext
        ? `${this._parentContext}/${this.contextName}`
        : this.contextName,
    })
  }

  throwIfHasNotificationErrors() {
    if (this.hasNotificationErrors) {
      throw new NotificationError(this.notificationErrors)
    }
  }
}
