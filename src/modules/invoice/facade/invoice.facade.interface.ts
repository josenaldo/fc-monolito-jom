export interface GenerateInvoiceFacadeInputDto {
  id?: string
  name: string
  document: string
  street: string
  number: string
  complement: string
  city: string
  state: string
  zipcode: string
  items: {
    id: string
    name: string
    price: number
    quantity: number
  }[]
}

export interface GenerateInvoiceFacadeOutputDto {
  id: string
  name: string
  document: string
  street: string
  number: string
  complement: string
  city: string
  state: string
  zipcode: string
  items: {
    id: string
    name: string
    price: number
    quantity: number
    total: number
  }[]
  total: number
}

export interface FindInvoiceFacadeInputDto {
  id: string
}

export interface FindInvoiceFacadeOutputDto {
  id: string
  createdAt: Date
  updatedAt: Date
  name: string
  document: string
  address: {
    street: string
    number: string
    complement: string
    city: string
    state: string
    zipcode: string
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

export interface InvoiceFacadeInterface {
  create(
    input: GenerateInvoiceFacadeInputDto
  ): Promise<GenerateInvoiceFacadeOutputDto>

  find(input: FindInvoiceFacadeInputDto): Promise<FindInvoiceFacadeOutputDto>
}
