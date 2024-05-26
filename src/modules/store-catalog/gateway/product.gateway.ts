import { Product } from '@/modules/store-catalog/domain/product.entity'

export interface ProductGateway {
  findAll(): Promise<Product[]>
  find(id: string): Promise<Product>
}
