export interface AddClientUsecaseInputDto {
  id?: string
  name: string
  email: string
  document: string
  address: {
    street: string
    number: string
    complement?: string
    city: string
    state: string
    zipCode: string
  }
}

export interface AddClientUsecaseOutputDto {
  id: string
  createdAt: Date
  updatedAt: Date
  name: string
  email: string
  document: string
  address: {
    street: string
    number: string
    complement?: string
    city: string
    state: string
    zipCode: string
  }
}
