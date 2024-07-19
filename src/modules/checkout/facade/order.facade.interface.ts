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
  clientId: string
  items: {
    productId: string
    quantity: number
  }[]
}

export interface FindOrderFacadeInputDto {
  id: string
}

export interface FindOrderFacadeOutputDto {
  id: string
  clientId: string
  items: {
    productId: string
    quantity: number
  }[]
}