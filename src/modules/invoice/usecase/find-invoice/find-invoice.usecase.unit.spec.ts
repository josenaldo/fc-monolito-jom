import { Address } from '@/modules/@shared/domain/value-object/address'
import { Id } from '@/modules/@shared/domain/value-object/id.value-object'
import { InvoiceItem } from '@/modules/invoice/domain/entity/invoice-item.entity'
import { Invoice } from '@/modules/invoice/domain/entity/invoice.entity'
import { InvoiceGateway } from '@/modules/invoice/gateway/invoice.gateway'
import { CreateMockRepository } from '@/modules/invoice/test/invoice.test.utils'
import { FindInvoiceUsecase } from '@/modules/invoice/usecase/find-invoice/find-invoice.usecase'

describe('Find Invoice use case unit tests', () => {
  let repository: InvoiceGateway
  let usecase: FindInvoiceUsecase

  beforeEach(async () => {
    repository = CreateMockRepository()
    usecase = new FindInvoiceUsecase(repository)
  })

  it('should find a invoice', async () => {
    // Arrange - Given
    const id = new Id()
    const address: Address = new Address({
      street: 'Street 1',
      number: '123',
      complement: 'Complement 1',
      city: 'City 1',
      state: 'State 1',
      zipCode: '12345678',
    })

    const item: InvoiceItem = new InvoiceItem({
      id: new Id(),
      name: 'Product 1',
      price: 10,
      quantity: 4,
    })

    const expectedInvoice = new Invoice({
      id: id,
      createdAt: new Date(),
      updatedAt: new Date(),
      name: 'Invoice 1',
      document: '123456789',
      address: address,
      items: [item],
    })

    repository.find = jest.fn().mockResolvedValue(expectedInvoice)

    // Act - When
    const output = await usecase.execute({ id: id.value })

    // Assert - Then
    expect(repository.find).toHaveBeenCalledTimes(1)
    expect(repository.find).toHaveBeenCalledWith(id.value)
    expect(output).toEqual({
      id: id.value,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      name: 'Invoice 1',
      document: '123456789',
      address: expect.objectContaining({
        street: 'Street 1',
        number: '123',
        complement: 'Complement 1',
        city: 'City 1',
        state: 'State 1',
        zipCode: '12345678',
      }),
      total: 40,
      items: [
        expect.objectContaining({
          id: expect.any(String),
          name: 'Product 1',
          price: 10,
          quantity: 4,
          total: 40,
        }),
      ],
    })
  })

  it('should throw a Not Found error when trying to find a invoice that does not exist', async () => {
    // Arrange - Given
    const id = new Id().value
    repository.find = jest.fn().mockResolvedValue(undefined)

    // Act - When
    const output = usecase.execute({ id: id })

    // Assert - Then
    await expect(output).rejects.toThrow(new Error('Invoice not found'))
  })

  it('should throw an error when trying to find a invoice with an invalid id', async () => {
    // Arrange - Given
    const id = 'invalid-id'
    repository.find = jest.fn().mockResolvedValue(undefined)
    // Act - When
    const output = usecase.execute({ id: id })

    // Assert - Then
    await expect(output).rejects.toThrow(new Error('Invoice not found'))
  })

  it('should throw an error when trying to find a invoice with an empty id', async () => {
    // Arrange - Given
    const id = ''
    repository.find = jest.fn().mockResolvedValue(undefined)

    // Act - When
    const output = usecase.execute({ id: id })

    // Assert - Then
    await expect(output).rejects.toThrow(new Error('Invoice not found'))
  })
})
