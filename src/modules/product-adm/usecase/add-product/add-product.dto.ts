export interface AddProductUsecaseInputDto {
  id?: string
  name: string
  description: string
  purchasePrice: number
  salesPrice: number
  stock: number
}

export interface AddProductUsecaseOutputDto {
  id: string
  createdAt: Date
  updatedAt: Date
  name: string
  description: string
  purchasePrice: number
  salesPrice: number
  stock: number
}
