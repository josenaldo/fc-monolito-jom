import { InvoiceItem } from '@/modules/invoice/domain/entity/invoice-item.entity'
import { Invoice } from '@/modules/invoice/domain/entity/invoice.entity'
import Address from '@/modules/invoice/domain/value-object/address'

describe('Invoice unit tests ', () => {
  let address: Address
  let invoiceItem1: InvoiceItem
  let invoiceItem2: InvoiceItem
  let invoiceProps: any

  beforeEach(() => {
    address = new Address({
      street: 'Fake Street',
      number: '123',
      complement: 'Fake Complement',
      zipCode: '12345-123',
      city: 'Fake City',
      state: 'Fake State',
    })

    invoiceItem1 = new InvoiceItem({
      name: 'Product 1',
      quantity: 1,
      price: 10.0,
    })
    invoiceItem2 = new InvoiceItem({
      name: 'Product 2',
      quantity: 2,
      price: 20.0,
    })

    invoiceProps = {
      name: 'Fake Name',
      document: '12345678901',
      address: address,
      items: [invoiceItem1, invoiceItem2],
    }
  })

  it('should create an Invoice instance', () => {
    // Arrange - Given

    // Act - When
    const invoice = new Invoice(invoiceProps)

    // Assert - Then
    expect(invoice).toBeDefined()
    expect(invoice.name).toBe(invoiceProps.name)
    expect(invoice.document).toBe(invoiceProps.document)
    expect(invoice.address).toBe(invoiceProps.address)
    expect(invoice.items).toBe(invoiceProps.items)
    expect(invoice.total).toBe(50.0)
  })

  it('should throw an error if name is empty', () => {
    // Arrange - Given
    invoiceProps.name = ''

    // Act - When
    const invoice = () => new Invoice(invoiceProps)

    // Assert - Then
    expect(invoice).toThrow('invoice/invoice: Name is required')
  })

  it('should throw an error if document is empty', () => {
    // Arrange - Given
    invoiceProps.document = ''

    // Act - When
    const invoice = () => new Invoice(invoiceProps)

    // Assert - Then
    expect(invoice).toThrow('invoice/invoice: Document is required')
  })
})
