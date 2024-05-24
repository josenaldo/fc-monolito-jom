import Notification, {
  NotificationErrorProps,
} from '@/modules/@shared/domain/notification/notification'

export default class NotificationError extends Error {
  constructor(public errors: NotificationErrorProps[]) {
    super(Notification.messages(errors))
  }
}
