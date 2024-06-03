export interface AddClientUsecaseInputDto {
  id?: string
  name: string
  email: string
  address: string
}

export interface AddClientUsecaseOutputDto {
  id: string
  createdAt: Date
  updatedAt: Date
  name: string
  email: string
  address: string
}
