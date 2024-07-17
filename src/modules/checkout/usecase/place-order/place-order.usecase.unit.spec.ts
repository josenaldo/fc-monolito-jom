import { Address } from '@/modules/@shared/domain/value-object/address'
import { Id } from '@/modules/@shared/domain/value-object/id.value-object'
import { Client } from '@/modules/checkout/domain/entity/client.entity'
import { OrderItem } from '@/modules/checkout/domain/entity/order-item.entity'
import { OrderStatus } from '@/modules/checkout/domain/entity/order.entity'
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
import {
  FindProductOutput,
  PlaceOrderUsecase,
} from '@/modules/checkout/usecase/place-order/place-order.usecase'
import {
  ClientAdmFacadeInterface,
  FindClientFacadeOutputDto,
} from '@/modules/client-adm/facade/client-adm.facade.interface'
import { InvoiceFacadeInterface } from '@/modules/invoice/facade/invoice.facade.interface'
import { PaymentFacadeInterface } from '@/modules/payment/facade/payment.facade.interface'
import { ProductAdmFacadeInterface } from '@/modules/product-adm/facade/product-adm.facade.interface'
import { Product } from '@/modules/store-catalog/domain/entity/product.entity'
import {
  FindStoreCatalogFacadeOutputDto,
  StoreCatalogFacadeInterface,
} from '@/modules/store-catalog/facade/store-catalog.facade.interface'

describe('Place Order usecase unit tests', () => {
  let repository: CheckoutGateway
  let usecase: PlaceOrderUsecase

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
        zipcode: '12345678',
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
      expect(output.address.zipcode).toBe(clientFacadeOutput.address.zipcode)
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
      const products = await usecase['findProducts'](input)
      const output = usecase['createOrderItems'](input, products)

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
    let product1: Product
    let product2: Product
    let findProductsOutput: FindProductOutput

    let findClientSpy: jest.SpyInstance
    let validateItemsSpy: jest.SpyInstance
    let createOrderItemsSpy: jest.SpyInstance
    let findProductSpy: jest.SpyInstance

    beforeEach(async () => {
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
          zipcode: '12345678',
        }),
      })

      findClientSpy = jest
        //@ts-expect-error - jest.spyOn does not accept private methods
        .spyOn(usecase, 'findClient')
        //@ts-expect-error - not return never
        .mockResolvedValue(clientFacadeOutput)

      validateItemsSpy = jest
        //@ts-expect-error - jest.spyOn does not accept private methods
        .spyOn(usecase, 'validateItems')
        //@ts-expect-error - not return never
        .mockImplementation((input: PlaceOrderUsecaseInputDto) =>
          Promise.resolve()
        )

      createOrderItemsSpy = jest
        //@ts-expect-error - jest.spyOn does not accept private methods
        .spyOn(usecase, 'createOrderItems')

      findProductSpy = jest
        //@ts-expect-error - jest.spyOn does not accept private methods
        .spyOn(usecase, 'findProduct')
        //@ts-expect-error - not return never
        .mockImplementation(
          async (
            productId: string
          ): Promise<FindStoreCatalogFacadeOutputDto> => {
            const product = products.find(
              (product) => product.id.value === productId
            )
            return Promise.resolve({
              id: product.id.value,
              name: product.name,
              description: product.description,
              salesPrice: product.salesPrice,
            })
          }
        )
    })

    it('should place an order that should not be approved', async () => {
      // Arrange - Given
      itemProps1 = {
        productId: itemProps1.productId,
        quantity: 1,
      }
      itemProps2 = {
        productId: itemProps2.productId,
        quantity: 2,
      }

      product1 = new Product({
        id: new Id(itemProps1.productId),
        createdAt: new Date(),
        updatedAt: new Date(),
        name: `Product ${itemProps1.productId}`,
        description: `Product ${itemProps1.productId} description`,
        salesPrice: 10,
      })

      product2 = new Product({
        id: new Id(itemProps2.productId),
        createdAt: new Date(),
        updatedAt: new Date(),
        name: `Product ${itemProps2.productId}`,
        description: `Product ${itemProps2.productId} description`,
        salesPrice: 20,
      })

      products = [product1, product2]

      orderItems = [
        new OrderItem({
          id: new Id(),
          productId: itemProps1.productId,
          quantity: itemProps1.quantity,
          price: product1.salesPrice,
        }),
        new OrderItem({
          id: new Id(),
          productId: itemProps2.productId,
          quantity: itemProps2.quantity,
          price: product2.salesPrice,
        }),
      ]

      findProductsOutput = {
        [product1.id.value]: {
          productId: product1.id.value,
          name: `${product1.name}`,
          quantity: itemProps1.quantity,
          price: product1.salesPrice,
        },
        [product2.id.value]: {
          productId: product2.id.value,
          name: `${product2.name}`,
          quantity: itemProps2.quantity,
          price: product2.salesPrice,
        },
      }

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
      expect(output.status).toBe(OrderStatus.CANCELLED)
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
      expect(createOrderItemsSpy).toHaveBeenCalledWith(
        input,
        findProductsOutput
      )

      expect(repository.add).toHaveBeenCalledTimes(1)

      expect(paymentFacade.process).toHaveBeenCalledTimes(1)
      expect(paymentFacade.process).toHaveBeenCalledWith({
        amount: 50,
        orderId: output.id,
      })

      expect(invoiceFacade.create).toHaveBeenCalledTimes(0)
    })

    it('should place an order that should be approved', async () => {
      itemProps1 = {
        productId: itemProps1.productId,
        quantity: 10,
      }
      itemProps2 = {
        productId: itemProps2.productId,
        quantity: 20,
      }
      product1 = new Product({
        id: new Id(itemProps1.productId),
        createdAt: new Date(),
        updatedAt: new Date(),
        name: `Product ${itemProps1.productId}`,
        description: `Product ${itemProps1.productId} description`,
        salesPrice: 10,
      })

      product2 = new Product({
        id: new Id(itemProps2.productId),
        createdAt: new Date(),
        updatedAt: new Date(),
        name: `Product ${itemProps2.productId}`,
        description: `Product ${itemProps2.productId} description`,
        salesPrice: 20,
      })
      products = [product1, product2]

      orderItems = [
        new OrderItem({
          id: new Id(),
          productId: itemProps1.productId,
          quantity: itemProps1.quantity,
          price: product1.salesPrice,
        }),
        new OrderItem({
          id: new Id(),
          productId: itemProps2.productId,
          quantity: itemProps2.quantity,
          price: product2.salesPrice,
        }),
      ]

      findProductsOutput = {
        [product1.id.value]: {
          productId: product1.id.value,
          name: `${product1.name}`,
          quantity: itemProps1.quantity,
          price: product1.salesPrice,
        },
        [product2.id.value]: {
          productId: product2.id.value,
          name: `${product2.name}`,
          quantity: itemProps2.quantity,
          price: product2.salesPrice,
        },
      }

      // Arrange - Given

      paymentFacade.process = jest.fn().mockResolvedValue({
        transactionId: new Id().value,
        createdAt: new Date(),
        updatedAt: new Date(),
        orderId: new Id().value,
        amount: 500,
        status: 'approved',
      })

      const invoiceId = new Id()
      invoiceFacade.create = jest.fn().mockResolvedValue({
        id: invoiceId.value,
        createdAt: new Date(),
        updatedAt: new Date(),
        name: client.name,
        document: client.document,
        street: client.address.street,
        number: client.address.number,
        complement: client.address.complement,
        city: client.address.city,
        state: client.address.state,
        zipcode: client.address.zipcode,
        items: orderItems.map((item) => ({
          id: item.productId,
          name: `Product ${item.productId}`,
          quantity: item.quantity,
          price: item.price,
        })),
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
      expect(output.invoiceId).toBeDefined()
      expect(output.invoiceId).toBe(invoiceId.value)
      expect(output.status).toBe(OrderStatus.APPROVED)
      expect(output.total).toBe(500)
      expect(output.items).toBeDefined()
      expect(output.items.length).toBe(2)
      expect(output.items[0].productId).toBe(products[0].id.value)
      expect(output.items[0].quantity).toBe(10)
      expect(output.items[0].price).toBe(products[0].salesPrice)
      expect(output.items[1].productId).toBe(products[1].id.value)
      expect(output.items[1].quantity).toBe(20)
      expect(output.items[1].price).toBe(products[1].salesPrice)

      expect(findClientSpy).toHaveBeenCalledTimes(1)
      expect(findClientSpy).toHaveBeenCalledWith(input)

      expect(validateItemsSpy).toHaveBeenCalledTimes(1)
      expect(validateItemsSpy).toHaveBeenCalledWith(input)

      expect(findProductSpy).toHaveBeenCalledTimes(2)
      expect(createOrderItemsSpy).toHaveBeenCalledTimes(1)
      expect(createOrderItemsSpy).toHaveBeenCalledWith(
        input,
        findProductsOutput
      )

      expect(repository.add).toHaveBeenCalledTimes(1)

      expect(paymentFacade.process).toHaveBeenCalledTimes(1)
      expect(paymentFacade.process).toHaveBeenCalledWith({
        amount: 500,
        orderId: output.id,
      })

      expect(invoiceFacade.create).toHaveBeenCalledTimes(1)
      expect(invoiceFacade.create).toHaveBeenCalledWith({
        id: expect.any(String),
        name: client.name,
        document: client.document,
        street: client.address.street,
        number: client.address.number,
        complement: client.address.complement,
        city: client.address.city,
        state: client.address.state,
        zipcode: client.address.zipcode,
        items: orderItems.map((item) => ({
          id: item.productId,
          name: `Product ${item.productId}`,
          quantity: item.quantity,
          price: item.price,
        })),
      })
    })
  })
})
