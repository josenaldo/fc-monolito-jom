export interface FindProductInputDto {
  id: string
}

export interface FindProductOutputDto {
  id: string
  createdAt: Date
  updatedAt: Date
  name: string
  description: string
  salesPrice: number
}