export interface PlaceOrderFacadeInputDto {
  id?: string
  clientId: string
  items: {
    productId: string
    quantity: number
  }[]
}

export interface PlaceOrderFacadeOutputDto {
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

export interface FindOrderFacadeInputDto {
  id: string
}

export interface FindOrderFacadeOutputDto {
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

export interface CheckoutFacadeInterface {
  placeOrder(
    input: PlaceOrderFacadeInputDto
  ): Promise<PlaceOrderFacadeOutputDto>

  findOrder(input: FindOrderFacadeInputDto): Promise<FindOrderFacadeOutputDto>
}
