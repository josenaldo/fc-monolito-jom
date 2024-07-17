export interface AddProductFacadeInputDto {
  id?: string
  name: string
  description: string
  purchasePrice: number
  salesPrice: number
  stock: number
}

export interface AddProductFacadeOutputDto {
  id: string
  createdAt: Date
  updatedAt: Date
  name: string
  description: string
  purchasePrice: number
  salesPrice: number
  stock: number
}

export interface CheckStockFacadeInputDto {
  productId: string
}

export interface CheckStockFacadeOutputDto {
  productId: string
  stock: number
}

export interface FindProductFacadeInputDto {
  id: string
}

export interface FindProductFacadeOutputDto {
  id: string
  createdAt: Date
  updatedAt: Date
  name: string
  description: string
  purchasePrice: number
  salesPrice: number
  stock: number
}

export interface ProductAdmFacadeInterface {
  addProduct(
    input: AddProductFacadeInputDto
  ): Promise<AddProductFacadeOutputDto>

  checkStock(
    input: CheckStockFacadeInputDto
  ): Promise<CheckStockFacadeOutputDto>

  findProduct(
    input: FindProductFacadeInputDto
  ): Promise<FindProductFacadeOutputDto>
}
