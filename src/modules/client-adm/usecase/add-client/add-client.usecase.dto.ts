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
    zipcode: string
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
    zipcode: string
  }
}
