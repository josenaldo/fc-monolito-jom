export interface AddProductInputDto {
  id?: string
  name: string
  description: string
  purchasePrice: number
  stock: number
}

export interface AddProductOutputDto {
  id: string
  createdAt: Date
  updatedAt: Date
  name: string
  description: string
  purchasePrice: number
  stock: number
}
