export interface FindInvoiceUsecaseInputDto {
  id: string
}

export interface FindInvoiceUsecaseOutputDto {
  id: string
  createdAt: Date
  updatedAt: Date
  name: string
  document: string
  address: {
    street: string
    number: string
    complement?: string
    city: string
    state: string
    zipCode: string
  }
  items: {
    id: string
    name: string
    price: number
    quantity: number
    total: number
  }[]
  total: number
}
