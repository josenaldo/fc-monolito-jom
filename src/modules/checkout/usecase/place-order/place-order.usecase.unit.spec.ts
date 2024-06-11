import { Address } from '@/modules/@shared/domain/value-object/address'
import { Id } from '@/modules/@shared/domain/value-object/id.value-object'
import { Client } from '@/modules/checkout/domain/entity/client.entity'
import { OrderItem } from '@/modules/checkout/domain/entity/order-item.entity'
import { CheckoutGateway } from '@/modules/checkout/gateway/checkout.gateway'
import {
  CreateMockClientFacade,
  CreateMockInvoiceFacade,
  CreateMockPaymentFacade,
  CreateMockProductFacade,
  CreateMockRepository,
  CreateMockStoreCatalogFacade,
} from '@/modules/checkout/test/checkout.test.utils'
import { PlaceOrderUsecaseInputDto } from '@/modules/checkout/usecase/place-order/place-order.dto'
import { PlaceOrderUsecase } from '@/modules/checkout/usecase/place-order/place-order.usecase'
import {
  ClientAdmFacadeInterface,
  FindClientFacadeOutputDto,
} from '@/modules/client-adm/facade/client-adm.facade.interface'
import { InvoiceFacadeInterface } from '@/modules/invoice/facade/invoice.facade.interface'
import { PaymentFacadeInterface } from '@/modules/payment/facade/payment.facade.interface'
import { ProductAdmFacadeInterface } from '@/modules/product-adm/facade/product-adm.facade.interface'
import { Product } from '@/modules/store-catalog/domain/entity/product.entity'
import { StoreCatalogFacadeInterface } from '@/modules/store-catalog/facade/store-catalog.facade.interface'

describe('Place Order usecase unit tests', () => {
  let usecase: PlaceOrderUsecase
  let repository: CheckoutGateway

  let clientFacade: ClientAdmFacadeInterface
  let productFacade: ProductAdmFacadeInterface
  let storeCatalogFacade: StoreCatalogFacadeInterface
  let paymentFacade: PaymentFacadeInterface
  let invoiceFacade: InvoiceFacadeInterface

  let clientFacadeOutput: FindClientFacadeOutputDto

  let itemProps1: { productId: string; quantity: number }
  let itemProps2: { productId: string; quantity: number }

  let input: PlaceOrderUsecaseInputDto
  const mockDate = new Date('2000-01-01T00:00:00')

  beforeEach(() => {
    repository = CreateMockRepository()
    clientFacade = CreateMockClientFacade()
    productFacade = CreateMockProductFacade()
    storeCatalogFacade = CreateMockStoreCatalogFacade()
    paymentFacade = CreateMockPaymentFacade()
    invoiceFacade = CreateMockInvoiceFacade()

    const props = {
      repository: repository,
      clientFacade: clientFacade,
      productFacade: productFacade,
      storeCatalogFacade: storeCatalogFacade,
      paymentFacade: paymentFacade,
      invoiceFacade: invoiceFacade,
    }

    usecase = new PlaceOrderUsecase(props)

    itemProps1 = {
      productId: new Id().value,
      quantity: 1,
    }
    itemProps2 = {
      productId: new Id().value,
      quantity: 2,
    }

    clientFacadeOutput = {
      id: new Id().value,
      createdAt: new Date(),
      updatedAt: new Date(),
      name: 'Test Client',
      email: 'client@test.com',
      document: '12345678901',
      address: {
        street: 'Test Street',
        number: '123',
        complement: 'Test Complement',
        city: 'Test City',
        state: 'Test State',
        zipCode: '12345678',
      },
    }

    input = {
      clientId: clientFacadeOutput.id,
      items: [itemProps1, itemProps2],
    }
  })

  describe('findClient method', () => {
    beforeEach(async () => {
      productFacade.checkStock = jest.fn().mockImplementation((props) => {
        return {
          productId: props.productId,
          stock: 100,
        }
      })

      storeCatalogFacade.find = jest.fn().mockImplementation((props) => {
        return {
          id: props.id,
          name: `Product ${props.id}`,
          description: `Product ${props.id} description`,
          salesPrice: 10,
        }
      })
    })

    it('should throw an error when client not found', async () => {
      // Arrange - Given
      clientFacade.findClient = jest.fn().mockResolvedValue(null)
      input.clientId = new Id().value

      // Act - When
      const output = usecase['findClient'](input)

      // Assert - Then
      await expect(output).rejects.toThrow(
        new Error('place-order: Client not found')
      )
    })

    it('should return the client from the repository', async () => {
      // Arrange - Given
      clientFacade.findClient = jest.fn().mockResolvedValue(clientFacadeOutput)

      // Act - When
      const output = await usecase['findClient'](input)

      // Assert - Then
      expect(output).toBeDefined()
      expect(output.id.value).toBe(clientFacadeOutput.id)
      expect(output.name).toBe(clientFacadeOutput.name)
      expect(output.email).toBe(clientFacadeOutput.email)
      expect(output.document).toBe(clientFacadeOutput.document)
      expect(output.address).toBeDefined()
      expect(output.address.street).toBe(clientFacadeOutput.address.street)
      expect(output.address.number).toBe(clientFacadeOutput.address.number)
      expect(output.address.complement).toBe(
        clientFacadeOutput.address.complement
      )
      expect(output.address.city).toBe(clientFacadeOutput.address.city)
      expect(output.address.state).toBe(clientFacadeOutput.address.state)
      expect(output.address.zipCode).toBe(clientFacadeOutput.address.zipCode)
    })
  })

  describe('validadeItems method', () => {
    beforeEach(() => {
      clientFacade.findClient = jest.fn().mockResolvedValue(clientFacadeOutput)

      productFacade.checkStock = jest.fn().mockImplementation((props) => {
        return {
          productId: props.productId,
          stock: 0,
        }
      })
    })

    it('should throw an error when products are empty', async () => {
      // Arrange - Given
      input.items = []

      // Act - When
      const output = usecase['validateItems'](input)

      // Assert - Then
      await expect(output).rejects.toThrow(
        new Error('place-order: No products selected')
      )
    })

    it('should throw an not available in stock error when product is not found', async () => {
      // Arrange - Given
      input.items = [itemProps1]

      // Act - When
      const output = usecase['validateItems'](input)

      // Assert - Then
      await expect(output).rejects.toThrow(
        new Error(
          `place-order: Product ${itemProps1.productId} is not available in stock`
        )
      )
    })

    it('should throw an not available in stock error when products are not found', async () => {
      // Arrange - Given

      // Act - When
      const output = usecase['validateItems'](input)

      // Assert - Then
      await expect(output).rejects.toThrow(
        new Error(
          `place-order: Product ${itemProps1.productId} is not available in stock, Product ${itemProps2.productId} is not available in stock`
        )
      )
    })

    it('should throw an error when product is out of stock', async () => {
      // Arrange - Given
      input.items = [itemProps1]

      // Act - When
      const output = usecase['validateItems'](input)

      // Assert - Then
      await expect(output).rejects.toThrow(
        new Error(
          `place-order: Product ${itemProps1.productId} is not available in stock`
        )
      )
    })

    it('should pass over the validation withou any errors', async () => {
      // Arrange - Given
      productFacade.checkStock = jest.fn().mockImplementation((props) => {
        return {
          productId: props.productId,
          stock: 100,
        }
      })

      storeCatalogFacade.find = jest.fn().mockImplementation((props) => {
        return {
          id: props.id,
          name: `Product ${props.id}`,
          description: `Product ${props.id} description`,
          salesPrice: 10,
        }
      })

      // Act - When
      await usecase['validateItems'](input)

      // Assert - Then
      const contextName = usecase['_CONTEXT_NAME']
      expect(usecase['_notification'].hasErrors(contextName)).toBeFalsy()
    })
  })

  describe('createOrderItems method', () => {
    beforeAll(() => {
      jest.useFakeTimers()
      jest.setSystemTime(mockDate)
    })

    afterAll(() => {
      jest.useRealTimers()
    })

    beforeEach(() => {})

    it('should return the products from the repository', async () => {
      // Arrange - Given
      storeCatalogFacade.find = jest.fn().mockImplementation((props) => {
        return {
          id: props.id,
          name: `Product ${props.id}`,
          description: `Product ${props.id} description`,
          salesPrice: 10,
        }
      })

      // Act - When
      const output = await usecase['createOrderItems'](input)

      // Assert - Then
      expect(output).toBeDefined()
      expect(output.length).toBe(2)
      expect(output[0].productId).toBe(itemProps1.productId)
      expect(output[0].quantity).toBe(itemProps1.quantity)
      expect(output[0].price).toBe(10)
      expect(output[0].total).toBe(10)

      expect(output[1].productId).toBe(itemProps2.productId)
      expect(output[1].quantity).toBe(itemProps2.quantity)
      expect(output[1].price).toBe(10)
      expect(output[1].total).toBe(20)
    })

    it('should throw an not found error when product is not found', async () => {
      // Arrange - Given
      storeCatalogFacade.find = jest.fn().mockResolvedValue(null)
      const id = new Id()

      // Act - When
      const output = usecase['findProduct'](id.value)

      // Assert - Then
      await expect(output).rejects.toThrow(
        new Error(`place-order: Product ${id.value} not found`)
      )
    })
  })

  describe('execute method', () => {
    let products: Product[]
    let orderItems: OrderItem[]
    let client: Client

    beforeEach(async () => {
      products = [
        new Product({
          id: new Id(itemProps1.productId),
          createdAt: new Date(),
          updatedAt: new Date(),
          name: `Product ${itemProps1.productId}`,
          description: `Product ${itemProps1.productId} description`,
          salesPrice: 10,
        }),
        new Product({
          id: new Id(itemProps2.productId),
          createdAt: new Date(),
          updatedAt: new Date(),
          name: `Product ${itemProps2.productId}`,
          description: `Product ${itemProps2.productId} description`,
          salesPrice: 20,
        }),
      ]

      orderItems = [
        new OrderItem({
          id: new Id(),
          productId: products[0].id.value,
          quantity: itemProps1.quantity,
          price: products[0].salesPrice,
        }),
        new OrderItem({
          id: new Id(),
          productId: products[1].id.value,
          quantity: itemProps2.quantity,
          price: products[1].salesPrice,
        }),
      ]

      client = new Client({
        id: new Id(clientFacadeOutput.id),
        name: clientFacadeOutput.name,
        email: clientFacadeOutput.email,
        document: clientFacadeOutput.document,
        address: new Address({
          street: 'Test Street',
          number: '123',
          complement: 'Test Complement',
          city: 'Test City',
          state: 'Test State',
          zipCode: '12345678',
        }),
      })
    })

    it('should place an order that should not be approved', async () => {
      // Arrange - Given
      const findClientSpy = jest
        //@ts-expect-error - jest.spyOn does not accept private methods
        .spyOn(usecase, 'findClient')
        //@ts-expect-error - not return never
        .mockResolvedValue(clientFacadeOutput)

      const validateItemsSpy = jest
        //@ts-expect-error - jest.spyOn does not accept private methods
        .spyOn(usecase, 'validateItems')
        //@ts-expect-error - not return never
        .mockImplementation((input: PlaceOrderUsecaseInputDto) =>
          Promise.resolve()
        )

      const createOrderItemsSpy = jest
        //@ts-expect-error - jest.spyOn does not accept private methods
        .spyOn(usecase, 'createOrderItems')
        //@ts-expect-error - not return never
        .mockImplementation((input: PlaceOrderUsecaseInputDto) =>
          Promise.resolve(orderItems)
        )

      paymentFacade.process = jest.fn().mockResolvedValue({
        transactionId: new Id().value,
        createdAt: new Date(),
        updatedAt: new Date(),
        orderId: new Id().value,
        amount: 50,
        status: 'declined',
      })

      const input: PlaceOrderUsecaseInputDto = {
        clientId: client.id.value,
        items: [itemProps1, itemProps2],
      }
      // Act - When
      const output = await usecase.execute(input)

      // Assert - Then
      expect(output).toBeDefined()
      expect(output.id).toBeDefined()
      expect(output.invoiceId).toBeNull()
      expect(output.status).toBe('declined')
      expect(output.total).toBe(50)
      expect(output.items).toBeDefined()
      expect(output.items.length).toBe(2)
      expect(output.items[0].productId).toBe(products[0].id.value)
      expect(output.items[0].quantity).toBe(itemProps1.quantity)
      expect(output.items[0].price).toBe(products[0].salesPrice)
      expect(output.items[1].productId).toBe(products[1].id.value)
      expect(output.items[1].quantity).toBe(itemProps2.quantity)
      expect(output.items[1].price).toBe(products[1].salesPrice)

      expect(findClientSpy).toHaveBeenCalledTimes(1)
      expect(findClientSpy).toHaveBeenCalledWith(input)

      expect(validateItemsSpy).toHaveBeenCalledTimes(1)
      expect(validateItemsSpy).toHaveBeenCalledWith(input)

      expect(createOrderItemsSpy).toHaveBeenCalledTimes(1)
      expect(createOrderItemsSpy).toHaveBeenCalledWith(input)

      expect(repository.add).toHaveBeenCalledTimes(1)

      expect(paymentFacade.process).toHaveBeenCalledTimes(1)
      expect(paymentFacade.process).toHaveBeenCalledWith({
        amount: 50,
        orderId: output.id,
      })

      expect(invoiceFacade.generateInvoice).toHaveBeenCalledTimes(0)
    })
  })
})
