import { Address } from '@/modules/@shared/domain/value-object/address'
import { Id } from '@/modules/@shared/domain/value-object/id.value-object'
import { Migrator } from '@/modules/@shared/test/migrator'
import { ClientProps } from '@/modules/checkout/domain/entity/client.entity'
import { OrderStatus } from '@/modules/checkout/domain/entity/order.entity'
import { CheckoutGateway } from '@/modules/checkout/gateway/checkout.gateway'
import { ClientModel } from '@/modules/checkout/repository/client.model'
import { OrderRepository } from '@/modules/checkout/repository/order.repository'
import { CreateMigrator } from '@/modules/checkout/test/checkout.test.utils'
import { PlaceOrderUsecaseInputDto } from '@/modules/checkout/usecase/place-order/place-order.dto'
import { PlaceOrderUsecase } from '@/modules/checkout/usecase/place-order/place-order.usecase'
import { ClientAdmFacadeInterface } from '@/modules/client-adm/facade/client-adm.facade.interface'
import { ClientAdmFacadeFactory } from '@/modules/client-adm/factory/client-adm.facade.factory'
import { InvoiceFacadeInterface } from '@/modules/invoice/facade/invoice.facade.interface'
import { InvoiceFacadeFactory } from '@/modules/invoice/factory/invoice.facade.factory'
import { PaymentFacadeInterface } from '@/modules/payment/facade/payment.facade.interface'
import { PaymentFacadeFactory } from '@/modules/payment/factory/payment.facade.factory'
import {
  AddProductFacadeInputDto,
  ProductAdmFacadeInterface,
} from '@/modules/product-adm/facade/product-adm.facade.interface'
import { ProductAdmFacadeFactory } from '@/modules/product-adm/factory/product-adm.facade.factory'
import { StoreCatalogFacadeInterface } from '@/modules/store-catalog/facade/store-catalog.facade.interface'
import { StoreCatalogFacadeFactory } from '@/modules/store-catalog/factory/store-catalog.facade.factory'

describe('Place Order usecase integration tests', () => {
  let migrator: Migrator
  let repository: CheckoutGateway
  let usecase: PlaceOrderUsecase

  let clientFacade: ClientAdmFacadeInterface
  let productFacade: ProductAdmFacadeInterface
  let storeCatalogFacade: StoreCatalogFacadeInterface
  let paymentFacade: PaymentFacadeInterface
  let invoiceFacade: InvoiceFacadeInterface

  let clientProps: ClientProps
  let productProps1: AddProductFacadeInputDto
  let productProps2: AddProductFacadeInputDto
  let productProps3: AddProductFacadeInputDto

  let itemProps1: { productId: string; quantity: number }
  let itemProps2: { productId: string; quantity: number }
  let itemProps3: { productId: string; quantity: number }

  let placeOrderInput: PlaceOrderUsecaseInputDto

  beforeEach(async () => {
    migrator = CreateMigrator()
    await migrator.up()

    repository = new OrderRepository()
    clientFacade = ClientAdmFacadeFactory.create()
    productFacade = ProductAdmFacadeFactory.create()
    storeCatalogFacade = StoreCatalogFacadeFactory.create()
    paymentFacade = PaymentFacadeFactory.create()
    invoiceFacade = InvoiceFacadeFactory.create()

    const orderUsecaseProps = {
      repository: repository,
      clientFacade: clientFacade,
      productFacade: productFacade,
      storeCatalogFacade: storeCatalogFacade,
      paymentFacade: paymentFacade,
      invoiceFacade: invoiceFacade,
    }

    usecase = new PlaceOrderUsecase(orderUsecaseProps)

    productProps1 = {
      id: new Id().value,
      name: 'Product 1',
      description: 'Product 1 description',
      purchasePrice: 10,
      salesPrice: 20,
      stock: 10,
    }

    productProps2 = {
      id: new Id().value,
      name: 'Product 2',
      description: 'Product 2 description',
      purchasePrice: 20,
      salesPrice: 40,
      stock: 20,
    }

    productProps3 = {
      id: new Id().value,
      name: 'Product 3',
      description: 'Product 3 description',
      purchasePrice: 30,
      salesPrice: 60,
      stock: 0,
    }

    itemProps1 = {
      productId: productProps1.id,
      quantity: 1,
    }
    itemProps2 = {
      productId: productProps2.id,
      quantity: 2,
    }
    itemProps3 = {
      productId: productProps3.id,
      quantity: 3,
    }

    const address = new Address({
      street: 'Test Street',
      number: '123',
      complement: 'Test Complement',
      city: 'Test City',
      state: 'Test State',
      zipcode: '12345678',
    })

    clientProps = {
      id: new Id(),
      name: 'Test Client',
      email: 'client@test.com',
      document: '12345678901',
      address: address,
    }

    await productFacade.addProduct(productProps1)
    await productFacade.addProduct(productProps2)
    await productFacade.addProduct(productProps3)

    await ClientModel.create({
      id: clientProps.id.value,
      createdAt: new Date(),
      updatedAt: new Date(),
      name: clientProps.name,
      email: clientProps.email,
      document: clientProps.document,
      street: address.street,
      number: address.number,
      complement: address.complement,
      city: address.city,
      state: address.state,
      zipcode: address.zipcode,
    })

    placeOrderInput = {
      clientId: clientProps.id.value,
      items: [itemProps1, itemProps2],
    }
  })

  afterEach(async () => {
    await migrator.down()
  })

  describe('findClient method', () => {
    it('should throw an error when client not found', async () => {
      // Arrange - Given
      placeOrderInput.clientId = new Id().value

      // Act - When
      const output = usecase['findClient'](placeOrderInput)

      // Assert - Then
      await expect(output).rejects.toThrow(new Error('Client not found'))
    })

    it('should return the client from the repository', async () => {
      // Arrange - Given

      // Act - When
      const output = await usecase['findClient'](placeOrderInput)

      // Assert - Then
      expect(output).toBeDefined()
      expect(output.id.value).toBe(clientProps.id.value)
      expect(output.name).toBe(clientProps.name)
      expect(output.email).toBe(clientProps.email)
      expect(output.document).toBe(clientProps.document)
      expect(output.address).toBeDefined()
      expect(output.address.street).toBe(clientProps.address.street)
      expect(output.address.number).toBe(clientProps.address.number)
      expect(output.address.complement).toBe(clientProps.address.complement)
      expect(output.address.city).toBe(clientProps.address.city)
      expect(output.address.state).toBe(clientProps.address.state)
      expect(output.address.zipcode).toBe(clientProps.address.zipcode)
    })
  })

  describe('validadeItems method', () => {
    it('should throw an error when products are empty', async () => {
      // Arrange - Given
      placeOrderInput.items = []

      // Act - When
      const output = usecase['validateItems'](placeOrderInput)

      // Assert - Then
      await expect(output).rejects.toThrow(
        new Error('place-order: No products selected')
      )
    })

    it('should throw an not available in stock error when product is not found', async () => {
      // Arrange - Given
      itemProps1.productId = new Id().value

      placeOrderInput.items = [itemProps1]

      // Act - When
      const output = usecase['validateItems'](placeOrderInput)

      // Assert - Then
      await expect(output).rejects.toThrow(
        new Error(
          `place-order: Product ${itemProps1.productId} is not available in stock`
        )
      )
    })

    it('should throw an not available in stock error when products are not found', async () => {
      // Arrange - Given
      itemProps1.productId = new Id().value
      itemProps2.productId = new Id().value

      // Act - When
      const output = usecase['validateItems'](placeOrderInput)

      // Assert - Then
      await expect(output).rejects.toThrow(
        new Error(
          `place-order: Product ${itemProps1.productId} is not available in stock, Product ${itemProps2.productId} is not available in stock`
        )
      )
    })

    it('should throw an error when product is out of stock', async () => {
      // Arrange - Given
      placeOrderInput.items = [itemProps3]

      // Act - When
      const output = usecase['validateItems'](placeOrderInput)

      // Assert - Then
      await expect(output).rejects.toThrow(
        new Error(
          `place-order: Product ${itemProps3.productId} is not available in stock`
        )
      )
    })

    it('should pass over the validation withou any errors', async () => {
      // Arrange - Given

      // Act - When
      await usecase['validateItems'](placeOrderInput)

      // Assert - Then
      const contextName = usecase['_CONTEXT_NAME']
      expect(usecase['_notification'].hasErrors(contextName)).toBeFalsy()
    })
  })

  describe('createOrderItems method', () => {
    beforeEach(() => {})

    it('should return the products from the repository', async () => {
      // Arrange - Given

      // Act - When
      const products = await usecase['findProducts'](placeOrderInput)
      const output = usecase['createOrderItems'](placeOrderInput, products)

      // Assert - Then
      expect(output).toBeDefined()
      expect(output.length).toBe(2)
      expect(output[0].productId).toBe(itemProps1.productId)
      expect(output[0].quantity).toBe(itemProps1.quantity)
      expect(output[0].price).toBe(20)
      expect(output[0].total).toBe(20)

      expect(output[1].productId).toBe(itemProps2.productId)
      expect(output[1].quantity).toBe(itemProps2.quantity)
      expect(output[1].price).toBe(40)
      expect(output[1].total).toBe(80)
    })

    it('should throw an not found error when product is not found', async () => {
      // Arrange - Given
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
    it('should place an order that should not be approved', async () => {
      // Arrange - Given
      itemProps1 = {
        productId: itemProps1.productId,
        quantity: 1,
      }
      itemProps2 = {
        productId: itemProps2.productId,
        quantity: 1,
      }

      const input: PlaceOrderUsecaseInputDto = {
        clientId: clientProps.id.value,
        items: [itemProps1, itemProps2],
      }
      // Act - When
      const output = await usecase.execute(input)

      // Assert - Then
      expect(output).toBeDefined()
      expect(output.id).toBeDefined()
      expect(output.invoiceId).toBeNull()
      expect(output.clientId).toBe(clientProps.id.value)
      expect(output.status).toBe(OrderStatus.CANCELLED)
      expect(output.total).toBe(60)
      expect(output.items).toBeDefined()
      expect(output.items.length).toBe(2)
      expect(output.items[0].productId).toBe(productProps1.id)
      expect(output.items[0].quantity).toBe(1)
      expect(output.items[0].price).toBe(20)
      expect(output.items[0].total).toBe(20)
      expect(output.items[1].productId).toBe(productProps2.id)
      expect(output.items[1].quantity).toBe(1)
      expect(output.items[1].price).toBe(40)
      expect(output.items[1].total).toBe(40)
    })

    it('should place an order that should be approved', async () => {
      // Arrange - Given
      itemProps1 = {
        productId: itemProps1.productId,
        quantity: 10,
      }
      itemProps2 = {
        productId: itemProps2.productId,
        quantity: 20,
      }

      const input: PlaceOrderUsecaseInputDto = {
        clientId: clientProps.id.value,
        items: [itemProps1, itemProps2],
      }
      // Act - When
      const output = await usecase.execute(input)

      // Assert - Then
      expect(output).toBeDefined()
      expect(output.id).toBeDefined()
      expect(output.invoiceId).toBeDefined()
      expect(output.clientId).toBe(clientProps.id.value)
      expect(output.status).toBe(OrderStatus.APPROVED)
      expect(output.total).toBe(1000)
      expect(output.items).toBeDefined()
      expect(output.items.length).toBe(2)
      expect(output.items[0].productId).toBe(productProps1.id)
      expect(output.items[0].quantity).toBe(10)
      expect(output.items[0].price).toBe(20)
      expect(output.items[0].total).toBe(200)
      expect(output.items[1].productId).toBe(productProps2.id)
      expect(output.items[1].quantity).toBe(20)
      expect(output.items[1].price).toBe(40)
      expect(output.items[1].total).toBe(800)
    })
  })
})
