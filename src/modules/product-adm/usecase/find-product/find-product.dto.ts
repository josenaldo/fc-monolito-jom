export interface FindProductInputDto {
  id: string
}

export interface FindProductOutputDto {
  id: string
  name: string
  description: string
  purchasePrice: number
  stock: number
  createdAt: Date
  updatedAt: Date
}
