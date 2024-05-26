import { Product } from '@/modules/product-adm/domain/entity/product.entity'

export interface ProductGateway {
  add(product: Product): Promise<void>
  find(id: string): Promise<Product>
}
