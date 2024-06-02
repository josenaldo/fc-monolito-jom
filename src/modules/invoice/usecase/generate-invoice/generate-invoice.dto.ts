export interface GenerateInvoiceUsecaseInputDto {
  id?: string
  name: string
  document: string
  street: string
  number: string
  complement?: string
  city: string
  state: string
  zipCode: string
  items: {
    id: string
    name: string
    price: number
    quantity: number
  }[]
}

export interface GenerateInvoiceUsecaseOutputDto {
  id: string
  createdAt: Date
  updatedAt: Date
  name: string
  document: string
  street: string
  number: string
  complement?: string
  city: string
  state: string
  zipCode: string
  items: {
    id: string
    name: string
    price: number
    quantity: number
    total: number
  }[]
  total: number
}
