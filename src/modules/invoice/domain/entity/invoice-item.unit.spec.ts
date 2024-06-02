import {
  InvoiceItem,
  InvoiceItemProps,
} from '@/modules/invoice/domain/entity/invoice-item.entity'

describe('Invoice Item unit tests', () => {
  let invoiceItemProps: InvoiceItemProps

  beforeEach(() => {
    invoiceItemProps = {
      name: 'Product 1',
      quantity: 2,
      price: 10.0,
    }
  })

  it('should create an Invoice Item instance', () => {
    // Arrange - Given

    // Act - When
    const invoiceItem = new InvoiceItem(invoiceItemProps)

    // Assert - Then
    expect(invoiceItem).toBeDefined()
    expect(invoiceItem.name).toBe(invoiceItemProps.name)
    expect(invoiceItem.quantity).toBe(invoiceItemProps.quantity)
    expect(invoiceItem.price).toBe(invoiceItemProps.price)
    expect(invoiceItem.total).toBe(20.0)
  })

  it('should throw an error if name is empty', () => {
    // Arrange - Given
    invoiceItemProps.name = ''

    // Act - When
    const invoiceItem = () => new InvoiceItem(invoiceItemProps)

    // Assert - Then
    expect(invoiceItem).toThrow('invoice/invoice-item: Name is required')
  })

  it('should throw an error if quantity is zero', () => {
    // Arrange - Given
    invoiceItemProps.quantity = 0

    // Act - When
    const invoiceItem = () => new InvoiceItem(invoiceItemProps)

    // Assert - Then
    expect(invoiceItem).toThrow(
      'invoice/invoice-item: Quantity must be greater than 0'
    )
  })

  it('should throw an error if price is zero', () => {
    // Arrange - Given
    invoiceItemProps.price = 0

    // Act - When
    const invoiceItem = () => new InvoiceItem(invoiceItemProps)

    // Assert - Then
    expect(invoiceItem).toThrow(
      'invoice/invoice-item: Price must be greater than 0'
    )
  })

  it('should throw an error if price is less than zero', () => {
    // Arrange - Given
    invoiceItemProps.price = -1

    // Act - When
    const invoiceItem = () => new InvoiceItem(invoiceItemProps)

    // Assert - Then
    expect(invoiceItem).toThrow(
      'invoice/invoice-item: Price must be greater than 0'
    )
  })

  it('should throw an error if quantity is less than zero', () => {
    // Arrange - Given
    invoiceItemProps.quantity = -1

    // Act - When
    const invoiceItem = () => new InvoiceItem(invoiceItemProps)

    // Assert - Then
    expect(invoiceItem).toThrow(
      'invoice/invoice-item: Quantity must be greater than 0'
    )
  })
})
