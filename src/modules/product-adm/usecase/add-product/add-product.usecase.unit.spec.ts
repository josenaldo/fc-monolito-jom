import Id from '@/modules/@shared/domain/value-object/id.value-object'
import ProductGateway from '@/modules/product-adm/gateway/product.gateway'
import {
  AddProductInputDto,
  AddProductOutputDto,
} from '@/modules/product-adm/usecase/add-product/add-product.dto'
import AddProductUseCase from '@/modules/product-adm/usecase/add-product/add-product.usecase'

const MockProductGateway = () => ({
  add: jest.fn(),
  find: jest.fn(),
})

describe('Add Product use case unit tests', () => {
  let gateway: ProductGateway
  let usecase: AddProductUseCase

  beforeEach(async () => {
    gateway = MockProductGateway()
    usecase = new AddProductUseCase(gateway)
  })

  it('should add a product', async () => {
    // Arrange
    const input: AddProductInputDto = {
      name: 'Product 1',
      description: 'Description 1',
      purchasePrice: 10,
      stock: 10,
    }

    // Act
    const output: AddProductOutputDto = await usecase.execute(input)

    // Assert
    expect(gateway.add).toHaveBeenCalledTimes(1)
    expect(gateway.add).toHaveBeenCalledWith(
      expect.objectContaining({
        _id: expect.any(Id),
        _name: input.name,
        _description: input.description,
        _purchasePrice: input.purchasePrice,
        _stock: input.stock,
        _createdAt: expect.any(Date),
        _updatedAt: expect.any(Date),
      })
    )
    expect(output.id).toBeDefined()
    expect(output.createdAt).toBeDefined()
    expect(output.updatedAt).toBeDefined()

    expect(output).toEqual({
      id: expect.any(String),
      name: input.name,
      description: input.description,
      purchasePrice: input.purchasePrice,
      stock: input.stock,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    })
  })
})
