export interface FindOrderUsecaseInputDto {
  id: string
}

export interface FindOrderUsecaseOutputDto {
  id: string
  clientId: string
  status: string
  total: number
  items: {
    productId: string
    quantity: number
    price: number
    total: number
  }[]
}
