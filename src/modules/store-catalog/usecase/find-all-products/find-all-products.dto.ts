export interface FindAllProductsOutputDto {
  totalCount: number
  products: {
    id: string
    name: string
    description: string
    salesPrice: number
  }[]
}
