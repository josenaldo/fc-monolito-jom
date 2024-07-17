export interface PlaceOrderUsecaseInputDto {
  clientId: string
  items: {
    productId: string
    quantity: number
  }[]
}

export interface PlaceOrderUsecaseOutputDto {
  id: string
  invoiceId?: string | null
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
