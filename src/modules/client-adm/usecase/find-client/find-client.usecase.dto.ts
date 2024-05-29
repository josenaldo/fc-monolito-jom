export interface FindClientInputDto {
  id: string
}

export interface FindClientOutputDto {
  id: string
  createdAt: Date
  updatedAt: Date
  name: string
  email: string
  address: string
}
