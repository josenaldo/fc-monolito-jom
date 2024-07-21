import { app } from '@/infrastructure/app-config'
import { CreateE2EMigrator } from '@/infrastructure/test.utils'
import { Id } from '@/modules/@shared/domain/value-object/id.value-object'
import { Migrator } from '@/modules/@shared/test/migrator'
import supertest from 'supertest'
import TestAgent from 'supertest/lib/agent.js'

describe('Products E2E tests', () => {
  let migrator: Migrator
  let request: TestAgent

  beforeEach(async () => {
    migrator = CreateE2EMigrator()
    await migrator.up()
    request = supertest(app)
  })

  afterEach(async () => {
    await migrator.down()
  })

  describe('when addProduct', () => {
    it('should add a product with an id', async () => {
      // Arrange - Given
      const id = new Id()
      const input = {
        id: id.value,
        name: 'Product name',
        description: 'Product description',
        purchasePrice: 10,
        salesPrice: 20,
        stock: 10,
      }

      // Act - When
      const response = await request.post('/products').send(input)

      // Assert - Then
      expect(response.status).toBe(201)
      expect(response.body).toBeDefined()

      expect(response.body.id).toBe(id.value)
      expect(response.body.createdAt).toBeDefined()
      expect(response.body.updatedAt).toBeDefined()
      expect(response.body.name).toBe('Product name')
      expect(response.body.description).toBe('Product description')
      expect(response.body.purchasePrice).toBe(10)
      expect(response.body.salesPrice).toBe(20)
      expect(response.body.stock).toBe(10)
    })

    it('should add a product without an id', async () => {
      // Arrange - Given
      const input = {
        name: 'product',
        description: 'description',
        purchasePrice: 10,
        salesPrice: 20,
        stock: 10,
      }

      // Act - When
      const response = await request.post('/products').send(input)

      // Assert - Then
      expect(response.body).toBeDefined()
      expect(response.body.id).toBeDefined()
      expect(response.body.createdAt).toBeDefined()
      expect(response.body.updatedAt).toBeDefined()
      expect(response.body.name).toBe('product')
      expect(response.body.description).toBe('description')
      expect(response.body.purchasePrice).toBe(10)
      expect(response.body.salesPrice).toBe(20)
      expect(response.body.stock).toBe(10)
    })

    it('should return an error 409 when product already exists', async () => {
      // Arrange - Given
      const id = new Id()

      const input = {
        id: id.value,
        name: 'product',
        description: 'description',
        purchasePrice: 10,
        salesPrice: 20,
        stock: 10,
      }

      // Act - When
      await request.post('/products').send(input)

      const input2 = {
        id: id.value,
        name: 'product 2',
        description: 'description 2',
        purchasePrice: 20,
        salesPrice: 40,
        stock: 20,
      }
      const response = await request.post('/products').send(input2)

      // Assert - Then
      expect(response.status).toBe(409)
      expect(response.body.error).toBe('Product already exists')
    })

    it('should return an error 400 when product is invalid', async () => {
      // Arrange - Given
      const input = {
        name: '',
        description: '',
        purchasePrice: -10,
        salesPrice: -5,
        stock: -10,
      }

      // Act - When
      const response = await request.post('/products').send(input)

      // Assert - Then
      expect(response.status).toBe(400)
      expect(response.body.error).toBe(
        'product-adm/product: Name is required, Description is required, Purchase Price must be greater than or equal to 0, Sales Price must be greater than 0, Stock must be greater than 0'
      )
    })
  })

  describe('when checkStock', () => {
    it('should check stock of a product', async () => {
      // Arrange - Given
      const id = new Id()
      const input = {
        id: id.value,
        name: 'product',
        description: 'description',
        purchasePrice: 10,
        salesPrice: 20,
        stock: 10,
      }
      await request.post('/products').send(input)

      // Act - When
      const response = await request.get(`/products/${id.value}/stock`)

      // Assert - Then
      expect(response.status).toBe(200)
      expect(response.body).toBeDefined()
      expect(response.body.productId).toBe(id.value)
      expect(response.body.stock).toBe(10)
    })

    it('should return 0 when product does not exist', async () => {
      // Arrange - Given
      const id = new Id()

      // Act - When
      const response = await request.get(`/products/${id.value}/stock`)

      // Assert - Then
      expect(response.status).toBe(200)
      expect(response.body).toBeDefined()
      expect(response.body.productId).toBe(id.value)
      expect(response.body.stock).toBe(0)
    })
  })

  describe('when findProduct', () => {
    it('should find a product', async () => {
      // Arrange - Given
      const id = new Id()
      const input = {
        id: id.value,
        name: 'product',
        description: 'description',
        purchasePrice: 10,
        salesPrice: 20,
        stock: 10,
      }
      await request.post('/products').send(input)

      // Act - When
      const response = await request.get(`/products/${id.value}`)

      // Assert - Then
      expect(response.status).toBe(200)
      expect(response.body).toBeDefined()
      expect(response.body.id).toBe(id.value)
      expect(response.body.name).toBe('product')
      expect(response.body.description).toBe('description')
      expect(response.body.purchasePrice).toBe(10)
      expect(response.body.salesPrice).toBe(20)
      expect(response.body.stock).toBe(10)
    })

    it('should return an error 404 when product not found', async () => {
      // Arrange - Given
      const id = new Id()

      // Act - When
      const response = await request.get(`/products/${id.value}`)

      // Assert - Then
      expect(response.status).toBe(404)
      expect(response.body).toBeDefined()
      expect(response.body.error).toBe('Product not found')
    })
  })
})
