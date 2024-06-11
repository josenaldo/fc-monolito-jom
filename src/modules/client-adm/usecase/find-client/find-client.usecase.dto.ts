export interface FindClientUsecaseInputDto {
  id: string
}

export interface FindClientUsecaseOutputDto {
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
