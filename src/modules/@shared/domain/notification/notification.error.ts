import {
  Notification,
  NotificationErrorProps,
} from '@/modules/@shared/domain/notification/notification'

export class NotificationError extends Error {
  constructor(public errors: NotificationErrorProps[]) {
    super(Notification.messages(errors))
  }
}
