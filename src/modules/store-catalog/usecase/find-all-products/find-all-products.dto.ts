export interface FindAllProductsUsecaseOutputDto {
  totalCount: number
  products: {
    id: string
    name: string
    description: string
    salesPrice: number
  }[]
}
