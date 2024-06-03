export interface FindProductUsecaseInputDto {
  id: string
}

export interface FindProductUsecaseOutputDto {
  id: string
  createdAt: Date
  updatedAt: Date
  name: string
  description: string
  salesPrice: number
}
