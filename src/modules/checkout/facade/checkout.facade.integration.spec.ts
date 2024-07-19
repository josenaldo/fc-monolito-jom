import { Id } from '@/modules/@shared/domain/value-object/id.value-object'
import { Migrator } from '@/modules/@shared/test/migrator'
import { OrderStatus } from '@/modules/checkout/domain/entity/order.entity'
import {
  CheckoutFacadeInterface,
  FindOrderFacadeInputDto,
  PlaceOrderFacadeInputDto,
} from '@/modules/checkout/facade/checkout.facade.interface'
import { CheckoutFacadeFactory } from '@/modules/checkout/factory/checkout.facade.factory'
import { ClientModel } from '@/modules/checkout/repository/client.model'
import OrderItemModel from '@/modules/checkout/repository/order-item.model'
import { OrderModel } from '@/modules/checkout/repository/order.model'
import { CreateMigrator } from '@/modules/checkout/test/checkout.test.utils'
import {
  AddProductFacadeInputDto,
  ProductAdmFacadeInterface,
} from '@/modules/product-adm/facade/product-adm.facade.interface'
import { ProductAdmFacadeFactory } from '@/modules/product-adm/factory/product-adm.facade.factory'

describe('Checkout facade integration tests', () => {
  let migrator: Migrator
  let checkoutFacade: CheckoutFacadeInterface
  let productFacade: ProductAdmFacadeInterface

  let orderId: Id
  let clientId: string

  let productProps1: AddProductFacadeInputDto
  let productProps2: AddProductFacadeInputDto
  let productProps3: AddProductFacadeInputDto

  let itemProps1: { productId: string; quantity: number }
  let itemProps2: { productId: string; quantity: number }
  let itemProps3: { productId: string; quantity: number }

  let placeOrderInput: PlaceOrderFacadeInputDto
  let findOrderInput: FindOrderFacadeInputDto

  beforeEach(async () => {
    migrator = CreateMigrator()
    await migrator.up()
    checkoutFacade = CheckoutFacadeFactory.create()
    productFacade = ProductAdmFacadeFactory.create()

    clientId = new Id().value
    orderId = new Id()
    const now = new Date()

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

    await productFacade.addProduct(productProps1)
    await productFacade.addProduct(productProps2)
    await productFacade.addProduct(productProps3)

    await ClientModel.create({
      id: clientId,
      createdAt: new Date(),
      updatedAt: new Date(),
      name: 'John Doe',
      email: 'john@teste.com',
      document: '12345678900',
      street: 'Main Street',
      number: '10',
      complement: 'Near the park',
      city: 'New York',
      state: 'NY',
      zipcode: '12345678',
    })

    await OrderModel.create(
      {
        id: orderId.value,
        createdAt: now,
        updatedAt: now,
        status: OrderStatus.APPROVED,
        total: 250,
        clientId: clientId,
        items: [
          {
            id: new Id().value,
            createdAt: now,
            updatedAt: now,
            orderId: orderId.value,
            productId: productProps1.id,
            quantity: 5,
            price: 10,
            total: 50,
          },
          {
            id: new Id().value,
            createdAt: now,
            updatedAt: now,
            orderId: orderId.value,
            productId: productProps2.id,
            quantity: 10,
            price: 20,
            total: 200,
          },
        ],
      },
      {
        include: [OrderItemModel, ClientModel],
      }
    )

    placeOrderInput = {
      clientId: clientId,
      items: [itemProps1, itemProps2],
    }

    findOrderInput = {
      id: orderId.value,
    }
  })

  afterEach(async () => {
    await migrator.down()
  })

  it('should find order', async () => {
    // Arrange - Given
    await checkoutFacade.placeOrder(placeOrderInput)

    // Act - When
    const output = await checkoutFacade.findOrder(findOrderInput)

    // Assert - Then
    expect(output).toEqual({
      id: orderId.value,
      status: OrderStatus.APPROVED,
      total: 250,
      clientId: clientId,
      items: [
        {
          productId: productProps1.id,
          quantity: 5,
          price: 10,
          total: 50,
        },
        {
          productId: productProps2.id,
          quantity: 10,
          price: 20,
          total: 200,
        },
      ],
    })
  })

  it('should throw an error when trying to find an order that does not exist', async () => {
    // Arrange - Given
    const input: FindOrderFacadeInputDto = { id: new Id().value }

    // Act - When
    const promise = checkoutFacade.findOrder(input)

    // Assert - Then
    await expect(promise).rejects.toThrow('Order not found')
  })

  it('should place an order that should not be approved', async () => {
    // Arrange - Given
    placeOrderInput.items = [itemProps1]

    // Act - When
    const output = await checkoutFacade.placeOrder(placeOrderInput)

    // Assert - Then
    expect(output).toEqual({
      id: expect.any(String),
      clientId: clientId,
      status: OrderStatus.CANCELLED,
      invoiceId: null,
      total: 20,
      items: [
        {
          productId: productProps1.id,
          quantity: 1,
          price: 20,
          total: 20,
        },
      ],
    })
  })

  it('should place an order that should be approved', async () => {
    // Arrange - Given
    placeOrderInput.items = [itemProps1, itemProps2]

    // Act - When
    const output = await checkoutFacade.placeOrder(placeOrderInput)

    // Assert - Then
    expect(output).toEqual({
      id: expect.any(String),
      clientId: clientId,
      status: OrderStatus.APPROVED,
      invoiceId: expect.any(String),
      total: 100,
      items: [
        {
          productId: productProps1.id,
          quantity: 1,
          price: 20,
          total: 20,
        },
        {
          productId: productProps2.id,
          quantity: 2,
          price: 40,
          total: 80,
        },
      ],
    })
  })

  it('should not place an order with a product not found', async () => {
    const newProductId = new Id().value
    // Arrange - Given

    placeOrderInput.items = [{ productId: newProductId, quantity: 1 }]

    // Act - When
    const output = checkoutFacade.placeOrder(placeOrderInput)

    // Assert - Then
    await expect(output).rejects.toThrow(
      new Error(
        `place-order: Product ${newProductId} is not available in stock`
      )
    )
  })

  it('should not place an order with a product out of stock', async () => {
    // Arrange - Given
    placeOrderInput.items = [itemProps3]

    // Act - When
    const output = checkoutFacade.placeOrder(placeOrderInput)

    // Assert - Then
    await expect(output).rejects.toThrow(
      new Error(
        `place-order: Product ${productProps3.id} is not available in stock`
      )
    )
  })

  it('should not place an order with a product quantity greater than stock', async () => {
    // Arrange - Given
    itemProps2.quantity = 300

    placeOrderInput.items = [itemProps2]

    // Act - When
    const output = checkoutFacade.placeOrder(placeOrderInput)

    // Assert - Then
    await expect(output).rejects.toThrow(
      new Error(
        `place-order: Product ${itemProps2.productId} is not available in stock`
      )
    )
  })

  it('should not place an order with a client not found', async () => {
    // Arrange - Given
    placeOrderInput.clientId = new Id().value

    // Act - When
    const output = checkoutFacade.placeOrder(placeOrderInput)

    // Assert - Then
    await expect(output).rejects.toThrow('Client not found')
  })
})
