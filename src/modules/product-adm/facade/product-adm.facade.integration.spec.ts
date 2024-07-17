import { Id } from '@/modules/@shared/domain/value-object/id.value-object'
import { Migrator } from '@/modules/@shared/test/migrator'
import { ProductAdmFacade } from '@/modules/product-adm/facade/product-adm.facade'
import {
  AddProductFacadeInputDto,
  AddProductFacadeOutputDto,
  FindProductFacadeInputDto,
  FindProductFacadeOutputDto,
} from '@/modules/product-adm/facade/product-adm.facade.interface'
import { ProductAdmFacadeFactory } from '@/modules/product-adm/factory/product-adm.facade.factory'
import { ProductRepository } from '@/modules/product-adm/repository/product.repository'
import { CreateMigrator } from '@/modules/product-adm/test/product-adm.test.utils'

describe('Product Adm facade integration tests', () => {
  let migrator: Migrator
  let productAdmFacade: ProductAdmFacade
  let repository: ProductRepository

  beforeEach(async () => {
    migrator = CreateMigrator()
    await migrator.up()

    repository = new ProductRepository()
    productAdmFacade = ProductAdmFacadeFactory.create()
  })

  afterEach(async () => {
    await migrator.down()
  })

  describe('when addProduct', () => {
    it('should add a product with an id', async () => {
      // Arrange - Given
      const id = new Id()
      const input: AddProductFacadeInputDto = {
        id: id.value,
        name: 'product',
        description: 'description',
        purchasePrice: 10,
        salesPrice: 20,
        stock: 10,
      }

      // Act - When
      await productAdmFacade.addProduct(input)

      // Assert - Then
      const product = await repository.find(id.value)
      expect(product).toBeDefined()
      expect(product.id.value).toBe(id.value)
      expect(product.createdAt).toBeDefined()
      expect(product.updatedAt).toBeDefined()
      expect(product.name).toBe('product')
      expect(product.description).toBe('description')
      expect(product.purchasePrice).toBe(10)
      expect(product.salesPrice).toBe(20)
      expect(product.stock).toBe(10)
    })

    it('should add a product without an id', async () => {
      // Arrange - Given
      const input: AddProductFacadeInputDto = {
        name: 'product',
        description: 'description',
        purchasePrice: 10,
        salesPrice: 20,
        stock: 10,
      }

      // Act - When
      const output: AddProductFacadeOutputDto =
        await productAdmFacade.addProduct(input)

      // Assert - Then
      const product = await repository.find(output.id)
      expect(product).toBeDefined()
      expect(product.id.value).toBe(output.id)
      expect(product.createdAt).toBeDefined()
      expect(product.updatedAt).toBeDefined()
      expect(product.name).toBe('product')
      expect(product.description).toBe('description')
      expect(product.purchasePrice).toBe(10)
      expect(product.salesPrice).toBe(20)
      expect(product.stock).toBe(10)
    })

    it('should throw an error when product already exists', async () => {
      // Arrange - Given
      const id = new Id()

      const input: AddProductFacadeInputDto = {
        id: id.value,
        name: 'product',
        description: 'description',
        purchasePrice: 10,
        salesPrice: 20,
        stock: 10,
      }

      // Act - When
      await productAdmFacade.addProduct(input)

      const input2: AddProductFacadeInputDto = {
        id: id.value,
        name: 'product 2',
        description: 'description 2',
        purchasePrice: 20,
        salesPrice: 40,
        stock: 20,
      }
      const output = productAdmFacade.addProduct(input2)

      // Assert - Then
      await expect(output).rejects.toThrow(new Error('Product already exists'))
    })

    it('should throw an error when product is invalid', async () => {
      // Arrange - Given
      const input: AddProductFacadeInputDto = {
        name: '',
        description: '',
        purchasePrice: -10,
        salesPrice: -5,
        stock: -10,
      }

      // Act - When
      const output = productAdmFacade.addProduct(input)

      // Assert - Then
      await expect(output).rejects.toThrow(
        new Error(
          'product-adm/product: Name is required, Description is required, Purchase Price must be greater than or equal to 0, Sales Price must be greater than 0, Stock must be greater than 0'
        )
      )
    })
  })

  describe('when checkStock', () => {
    it('should check stock of a product', async () => {
      // Arrange - Given
      const id = new Id()
      const input: AddProductFacadeInputDto = {
        id: id.value,
        name: 'product',
        description: 'description',
        purchasePrice: 10,
        salesPrice: 20,
        stock: 10,
      }
      await productAdmFacade.addProduct(input)

      // Act - When
      const output = await productAdmFacade.checkStock({ productId: id.value })

      // Assert - Then
      expect(output).toBeDefined()
      expect(output.productId).toBe(id.value)
      expect(output.stock).toBe(10)
    })

    it('should return 0 when product does not exist', async () => {
      // Arrange - Given
      const id = new Id()

      // Act - When
      const output = await productAdmFacade.checkStock({ productId: id.value })

      // Assert - Then
      expect(output).toBeDefined()
      expect(output.productId).toBe(id.value)
      expect(output.stock).toBe(0)
    })
  })

  describe('when findProduct', () => {
    it('should find a product', async () => {
      // Arrange - Given
      const id = new Id()
      const input: AddProductFacadeInputDto = {
        id: id.value,
        name: 'product',
        description: 'description',
        purchasePrice: 10,
        salesPrice: 20,
        stock: 10,
      }
      await productAdmFacade.addProduct(input)

      const findInput: FindProductFacadeInputDto = { id: id.value }

      // Act - When
      const output: FindProductFacadeOutputDto =
        await productAdmFacade.findProduct(findInput)

      // Assert - Then
      expect(output).toBeDefined()
      expect(output.id).toBe(id.value)
      expect(output.name).toBe('product')
      expect(output.description).toBe('description')
      expect(output.purchasePrice).toBe(10)
      expect(output.salesPrice).toBe(20)
      expect(output.stock).toBe(10)
    })

    it('should throw an error when product not found', async () => {
      // Arrange - Given
      const id = new Id()

      // Act - When
      const output = productAdmFacade.findProduct({ id: id.value })

      // Assert - Then
      await expect(output).rejects.toThrow(new Error('Product not found'))
    })
  })
})
