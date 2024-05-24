import Notification from '@/modules/@shared/domain/notification/notification'

describe('Notification unit tests', () => {
  it('should create error', async () => {
    const notification = new Notification()

    const error = {
      message: 'error message',
      context: 'Customer',
    }

    notification.addError(error)

    expect(notification.hasErrors()).toBe(true)
    expect(notification.hasErrors('Customer')).toBe(true)
    expect(notification.messages('Customer')).toBe('customer: error message')
  })

  it('should create errors', async () => {
    // Arrange - Given
    const notification = new Notification()

    const error1 = {
      message: 'error message 1',
      context: 'Customer',
    }

    const error2 = {
      message: 'error message 2',
      context: 'Customer',
    }

    const error3 = {
      message: 'error message 3',
      context: 'Order',
    }

    // Act - When
    notification.addError(error1)
    notification.addError(error2)
    notification.addError(error3)

    // Assert - Then
    expect(notification.hasErrors()).toBe(true)
    expect(notification.hasErrors('Customer')).toBe(true)
    expect(notification.hasErrors('Order')).toBe(true)
    expect(notification.hasErrors('Product')).toBe(false)

    expect(notification.messages('Customer')).toBe(
      'customer: error message 1, error message 2'
    )

    expect(notification.messages('Order')).toBe('order: error message 3')

    expect(notification.messages()).toBe(
      'customer: error message 1, error message 2 | order: error message 3'
    )
  })

  it('should not have errors', async () => {
    const notification = new Notification()

    expect(notification.hasErrors()).toBe(false)
  })

  it('should have errors', async () => {
    const notification = new Notification()

    const error = {
      message: 'error message',
      context: 'Customer',
    }

    notification.addError(error)

    expect(notification.hasErrors()).toBe(true)
  })

  it('should have errors by context', async () => {
    const notification = new Notification()

    const error = {
      message: 'error message',
      context: 'Customer',
    }

    notification.addError(error)

    expect(notification.hasErrors('Customer')).toBe(true)
    expect(notification.hasErrors('Order')).toBe(false)
  })

  it('should not have errors by context', async () => {
    const notification = new Notification()

    const error = {
      message: 'error message',
      context: 'Customer',
    }

    notification.addError(error)

    expect(notification.hasErrors('Order')).toBe(false)
  })

  it('should get all errors props', async () => {
    const notification = new Notification()

    const error1 = {
      message: 'error message',
      context: 'Customer',
    }

    const error2 = {
      message: 'error message',
      context: 'Order',
    }

    notification.addError(error1)
    notification.addError(error2)

    expect(notification.getErrors()).toEqual([error1, error2])
    expect(notification.getErrors('Customer')).toEqual([error1])
    expect(notification.getErrors('Order')).toEqual([error2])
  })
})
