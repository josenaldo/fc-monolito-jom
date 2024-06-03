export interface FindClientUsecaseInputDto {
  id: string
}

export interface FindClientUsecaseOutputDto {
  id: string
  createdAt: Date
  updatedAt: Date
  name: string
  email: string
  address: string
}
