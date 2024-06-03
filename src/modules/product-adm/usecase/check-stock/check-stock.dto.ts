export interface CheckStockUsecaseInputDto {
  productId: string
}

export interface CheckStockUsecaseOutputDto {
  productId: string
  stock: number
}
