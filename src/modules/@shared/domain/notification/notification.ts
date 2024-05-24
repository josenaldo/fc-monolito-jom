export type NotificationErrorProps = {
  message: string
  context: string
}

export default class Notification {
  private _errors: NotificationErrorProps[] = []

  hasErrors(context?: string): boolean {
    if (context) {
      return this._errors.some((error) => error.context === context)
    }
    return this._errors.length > 0
  }

  getErrors(context?: string): NotificationErrorProps[] {
    return this._errors.filter((error) => !context || error.context === context)
  }

  addError(error: NotificationErrorProps): void {
    this._errors.push(error)
  }

  messages(context?: string): string {
    return Notification.messages(this._errors, context)
  }

  static messages(errors: NotificationErrorProps[], context?: string): string {
    let messagesByContext: {
      [key: string]: string[]
    } = Notification.extractMessagesByContext(errors, context)

    const entries = Object.entries(messagesByContext)

    let messages = ''

    messages = Notification.convertMessagesByContextToString(entries, messages)

    return messages
  }

  private static extractMessagesByContext(
    errors: NotificationErrorProps[],
    context?: string
  ): {
    [key: string]: string[]
  } {
    let messagesByContext: {
      [key: string]: string[]
    } = {}

    errors
      .filter((error) => !context || error.context === context)
      .forEach((error) => {
        if (!messagesByContext[error.context]) {
          messagesByContext[error.context] = []
        }
        messagesByContext[error.context].push(error.message)
      })
    return messagesByContext
  }

  private static convertMessagesByContextToString(
    entries: [string, string[]][],
    messages: string
  ) {
    entries.forEach(([key, value], index) => {
      messages += `${key.toLowerCase()}: ${value.join(', ')}`
      if (index < entries.length - 1) {
        messages += ' | '
      }
    })
    return messages
  }
}
