export interface AddProductFacadeInputDto {
  id?: string
  name: string
  description: string
  purchasePrice: number
  stock: number
}

export interface CheckStockFacadeInputDto {
  productId: string
}

export interface CheckStockFacadeOutputDto {
  productId: string
  stock: number
}

export default interface productAdmFacadeInterface {
  addProduct(input: AddProductFacadeInputDto): Promise<void>
  checkStock(
    input: CheckStockFacadeInputDto
  ): Promise<CheckStockFacadeOutputDto>
}
