import Id from '@/modules/@shared/domain/value-object/id.value-object'
import { UsecaseInterface } from '@/modules/@shared/usecase/usecase.interface'
import Product from '@/modules/product-adm/domain/entity/product.entity'
import ProductGateway from '@/modules/product-adm/gateway/product.gateway'
import {
  AddProductInputDto,
  AddProductOutputDto,
} from '@/modules/product-adm/usecase/add-product/add-product.dto'

export default class AddProductUsecase implements UsecaseInterface {
  private _gateway: ProductGateway

  constructor(gateway: ProductGateway) {
    this._gateway = gateway
  }

  async execute(input: AddProductInputDto): Promise<AddProductOutputDto> {
    const id: Id = new Id(input.id)

    const product = new Product({
      id: id,
      name: input.name,
      description: input.description,
      purchasePrice: input.purchasePrice,
      stock: input.stock,
    })

    await this._gateway.add(product)

    return {
      id: product.id.value,
      name: product.name,
      description: product.description,
      purchasePrice: product.purchasePrice,
      stock: product.stock,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }
  }
}
