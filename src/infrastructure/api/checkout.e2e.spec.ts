import { app } from '@/infrastructure/app-config'
import { CreateE2EMigrator } from '@/infrastructure/test.utils'
import { Id } from '@/modules/@shared/domain/value-object/id.value-object'
import { Migrator } from '@/modules/@shared/test/migrator'
import { OrderStatus } from '@/modules/checkout/domain/entity/order.entity'
import { PlaceOrderFacadeInputDto } from '@/modules/checkout/facade/checkout.facade.interface'
import OrderItemModel from '@/modules/checkout/repository/order-item.model'
import { OrderModel } from '@/modules/checkout/repository/order.model'
import { ClientModel } from '@/modules/client-adm/repository/client.model'
import { ProductModel } from '@/modules/product-adm/repository/product.model'
import supertest from 'supertest'
import TestAgent from 'supertest/lib/agent.js'

describe('Checkout E2E tests', () => {
  let migrator: Migrator
  let request: TestAgent
  let orderId: Id
  let clientId: string

  let product1Id: string
  let product2Id: string
  let product3Id: string

  beforeEach(async () => {
    migrator = CreateE2EMigrator()
    await migrator.up()
    request = supertest(app)

    orderId = new Id()
    clientId = new Id().value
    product1Id = new Id().value
    product2Id = new Id().value
    product3Id = new Id().value

    await ProductModel.create({
      id: product1Id,
      createdAt: new Date(),
      updatedAt: new Date(),
      name: 'Product 1',
      description: 'Product 1 description',
      purchasePrice: 10,
      salesPrice: 20,
      stock: 10,
    })

    await ProductModel.create({
      id: product2Id,
      createdAt: new Date(),
      updatedAt: new Date(),
      name: 'Product 2',
      description: 'Product 2 description',
      purchasePrice: 20,
      salesPrice: 40,
      stock: 20,
    })

    await ProductModel.create({
      id: product3Id,
      createdAt: new Date(),
      updatedAt: new Date(),
      name: 'Product 3',
      description: 'Product 3 description',
      purchasePrice: 30,
      salesPrice: 60,
      stock: 0,
    })

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
        createdAt: new Date(),
        updatedAt: new Date(),
        status: OrderStatus.APPROVED,
        total: 250,
        clientId: clientId,
        items: [
          {
            id: new Id().value,
            createdAt: new Date(),
            updatedAt: new Date(),
            orderId: orderId.value,
            productId: product1Id,
            quantity: 5,
            price: 10,
            total: 50,
          },
          {
            id: new Id().value,
            createdAt: new Date(),
            updatedAt: new Date(),
            orderId: orderId.value,
            productId: product2Id,
            quantity: 10,
            price: 20,
            total: 200,
          },
        ],
      },
      {
        include: [
          { model: OrderItemModel, as: 'items' },
          { model: ClientModel, as: 'client' },
        ],
      }
    )
  })

  afterEach(async () => {
    await migrator.down()
  })

  it('should find an order', async () => {
    // Arrange - Given

    // Act - When
    const response = await request.get(`/checkout/${orderId.value}`)

    // Assert - Then
    expect(response.status).toBe(200)
    expect(response.body).toBeDefined()

    const order = response.body

    expect(order.id).toBe(orderId.value)
    expect(order.clientId).toBeDefined()
    expect(order.items).toBeDefined()
    expect(order.items.length).toBe(2)

    const item1 = order.items[0]
    expect(item1.productId).toBe(product1Id)
    expect(item1.quantity).toBe(5)
    expect(item1.price).toBe(10)
    expect(item1.total).toBe(50)

    const item2 = order.items[1]
    expect(item2.productId).toBe(product2Id)
    expect(item2.quantity).toBe(10)
    expect(item2.price).toBe(20)
    expect(item2.total).toBe(200)
  })

  it('should return 404 when order is not found', async () => {
    // Arrange - Given
    const id = new Id()

    // Act - When
    const response = await request.get(`/checkout/${id.value}`)

    // Assert - Then
    expect(response.status).toBe(404)
    expect(response.body).toBeDefined()
    expect(response.body.error).toBe('Order not found')
  })

  it('should place an order that should be approved', async () => {
    // Arrange - Given
    const input = {
      clientId: clientId,
      items: [
        { productId: product1Id, quantity: 5 },
        { productId: product2Id, quantity: 10 },
      ],
    }

    // Act - When
    const response = await request.post('/checkout').send(input)

    // Assert - Then
    expect(response.status).toBe(201)
    expect(response.body).toBeDefined()

    const order = response.body

    expect(order.id).toBeDefined()
    expect(order.clientId).toBe(clientId)
    expect(order.invoiceId).toBeDefined()
    expect(order.status).toBe(OrderStatus.APPROVED)
    expect(order.total).toBe(500)
    expect(order.items).toBeDefined()
    expect(order.items.length).toBe(2)

    const item1 = order.items[0]
    expect(item1.productId).toBe(product1Id)
    expect(item1.quantity).toBe(5)
    expect(item1.price).toBe(20)
    expect(item1.total).toBe(100)

    const item2 = order.items[1]
    expect(item2.productId).toBe(product2Id)
    expect(item2.quantity).toBe(10)
    expect(item2.price).toBe(40)
    expect(item2.total).toBe(400)
  })

  it('should place an order that should not be approved', async () => {
    // Arrange - Given
    const input = {
      clientId: clientId,
      items: [
        { productId: product1Id, quantity: 1 },
        { productId: product2Id, quantity: 1 },
      ],
    }

    // Act - When
    const response = await request.post('/checkout').send(input)

    // Assert - Then
    expect(response.status).toBe(201)
    expect(response.body).toBeDefined()

    const order = response.body

    expect(order.id).toBeDefined()
    expect(order.clientId).toBe(clientId)
    expect(order.invoiceId).toBeNull()
    expect(order.status).toBe(OrderStatus.CANCELLED)
    expect(order.total).toBe(60)
    expect(order.items).toBeDefined()
    expect(order.items.length).toBe(2)

    const item1 = order.items[0]
    expect(item1.productId).toBe(product1Id)
    expect(item1.quantity).toBe(1)
    expect(item1.price).toBe(20)
    expect(item1.total).toBe(20)

    const item2 = order.items[1]
    expect(item2.productId).toBe(product2Id)
    expect(item2.quantity).toBe(1)
    expect(item2.price).toBe(40)
    expect(item2.total).toBe(40)
  })

  it('should return 400 when trying to place an order with no products', async () => {
    // Arrange - Given
    const input: PlaceOrderFacadeInputDto = {
      clientId: clientId,
      items: [],
    }

    // Act - When
    const response = await request.post('/checkout').send(input)

    // Assert - Then
    expect(response.status).toBe(400)
    expect(response.body).toBeDefined()
    expect(response.body.error).toBe('place-order: No products selected')
  })

  it('should return 400 when trying to place an order with a product with no stock', async () => {
    // Arrange - Given
    const input: PlaceOrderFacadeInputDto = {
      clientId: clientId,
      items: [{ productId: product3Id, quantity: 1 }],
    }

    // Act - When
    const response = await request.post('/checkout').send(input)

    // Assert - Then
    expect(response.status).toBe(400)
    expect(response.body).toBeDefined()
    expect(response.body.error).toBe(
      `place-order: Product ${product3Id} is not available in stock`
    )
  })

  it('should return 404 when trying to place an order with a product not found', async () => {
    // Arrange - Given
    const newProductId = new Id().value
    const input: PlaceOrderFacadeInputDto = {
      clientId: clientId,
      items: [{ productId: newProductId, quantity: 1 }],
    }

    // Act - When
    const response = await request.post('/checkout').send(input)

    // Assert - Then
    expect(response.status).toBe(400)
    expect(response.body).toBeDefined()
    expect(response.body.error).toBe(
      `place-order: Product ${newProductId} is not available in stock`
    )
  })

  it('should return 400 when trying to place an order with a product quantity greater than stock', async () => {
    // Arrange - Given
    const input: PlaceOrderFacadeInputDto = {
      clientId: clientId,
      items: [{ productId: product2Id, quantity: 300 }],
    }

    // Act - When
    const response = await request.post('/checkout').send(input)

    // Assert - Then
    expect(response.status).toBe(400)
    expect(response.body).toBeDefined()
    expect(response.body.error).toBe(
      `place-order: Product ${product2Id} is not available in stock`
    )
  })

  it('should return 404 when trying to place an order with a client not found', async () => {
    // Arrange - Given
    const input: PlaceOrderFacadeInputDto = {
      clientId: new Id().value,
      items: [{ productId: product1Id, quantity: 1 }],
    }

    // Act - When
    const response = await request.post('/checkout').send(input)

    // Assert - Then
    expect(response.status).toBe(404)
    expect(response.body).toBeDefined()
    expect(response.body.error).toBe('Client not found')
  })
})
